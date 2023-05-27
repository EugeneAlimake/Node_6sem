const express = require('express');
const bodyParser = require('body-parser');
const {promisifyAll} = require('bluebird');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('25lab', 'sa', '12345', {host: '127.0.0.1', dialect: 'mssql'});
const {users, repos, commits} = require('./25-01-model').ORM(sequelize);
const redis = require('redis');
const path = require("path");
const fs = require("fs");
const {Ability, AbilityBuilder} = require("casl");
const secret = 'secret-key';
const app = express();

const redisClient = redis.createClient();

users.hasMany(repos, {foreignKey: "authorId"});
repos.belongsTo(users, {foreignKey: "authorId"});

repos.hasMany(commits, {foreignKey: "repoId"});
commits.belongsTo(repos, {foreignKey: "repoId"});

const accessKey = "my token key";
const refreshKey = "my refresh key";

app.use(cookieParser("my cookie key"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
    const {rules, can} = AbilityBuilder.extract();
    if (req.cookies.accessToken) {
        jwt.verify(req.cookies.accessToken, accessKey, (err, payload) => {
            if (err) next();
            else if (payload) {
                req.payload = payload;
                if (req.payload.role === "admin") {
                    can(["read", "create", "update"], ["repos", "commits"], {
                        authorId: req.payload.id,
                    });
                    can("read", "users", {id: req.payload.id});
                    can("manage", "all");
                }
                if (req.payload.role === "user") {
                    can(["read", "create", "update"], ["repos", "commits"], {
                        authorId: req.payload.id,
                    });
                    can("read", "users", {id: req.payload.id});
                }
            }
        });
    } else {
        req.payload = {id: 0};
        can("read", ["repos", "commits"], {authorId: req.payload.id});
    }
    req.ability = new Ability(rules);
    next();
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/register.html");
});

app.post("/login", async (req, res) => {
    const candidate = await users.findOne({
        where: {
            username: req.body.username,
            password: req.body.password,
        },
    });
    if (candidate) {
        const accessToken = jwt.sign(
            {id: candidate.id, username: candidate.username, role: candidate.role},
            accessKey,
            {expiresIn: '10m'},{httpOnly: true, SameSite:'strict'}
        );
        const refreshToken = jwt.sign(
            {id: candidate.id, username: candidate.username, role: candidate.role},
            refreshKey,
            {expiresIn: '24h'},{httpOnly: true, SameSite:'strict'}
        );
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
        });
        res.redirect("/resource");
    } else {
        res.redirect("/login");
    }
});

app.post("/register", async (req, res) => {
    const candidate = await users.findOne({
        where: {
            username: req.body.username,
        },
    });
    if (candidate) res.redirect("/register");
    else {
        await users.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
        });
        res.redirect("/login");
    }
});

app.get("/resource", (req, res) => {
    if (req.payload && req.payload.id !== 0)
        res
            .status(200)
            .send(
                `${req.payload.username}-${req.payload.role}`
            );
    else res.status(401).send("Non authorized");
});
app.get("/logout", (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.redirect("/login");
});

app.get("/api/ability", (req, res) => {
    res.status(200).send(req.ability.rules);
});

app.get("/api/user", async (req, res) => {
    try {
        req.ability.throwUnlessCan("manage", "all");
        const user = await users.findAll({
            attributes: ["id", "username", "email", "role"],
        });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/user/:id", async (req, res) => {
    try {
        req.ability.throwUnlessCan(
            "read",
            new users({id: Number(req.params.id)})
        );
        const user = await users.findOne({
            where: {
                id: req.params.id,
            },
            attributes: ["id", "username", "email", "role"],
        });
        if (user) res.status(200).json(user);
        else res.status(404).send("User is not found");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/repos", async (req, res) => {
    try {
        const repo = await repos.findAll();
        res.status(200).json(repo);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/repos/:id", async (req, res) => {
    try {
        const repo = await repos.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (repo) res.status(200).json(repo);
        else res.status(404).send("Repo is not found");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/api/repos", async (req, res) => {
    try {
        req.ability.throwUnlessCan("create", "repos");
        console.log(req.payload.id);
        const repo = await repos.create({
            name: req.body.name,
            authorId: req.payload.id,
        });
        res.status(201).json(repo);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put("/api/repos/:id", async (req, res) => {
    try {
        req.ability.throwUnlessCan("update", await repos.findByPk(req.params.id));
        await repos.update(
            {
                name: req.body.name,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.status(201).send("Repo is updated");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete("/api/repos/:id", async (req, res) => {
    try {
        req.ability.throwUnlessCan("manage", "all");
        await repos.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(201).send("Repo is deleted");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/repos/:id/commits", async (req, res) => {
    try {
        const commit = await commits.findAll({
            include: [
                {
                    model: repos,
                    required: true,
                    where: {
                        id: req.params.id,
                    },
                    attributes: [],
                },
            ],
        });
        res.status(200).json(commit);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/repos/:id/commits/:commitId", async (req, res) => {
    try {
        const commit = await commits.findOne({
            where: {
                id: req.params.commitId,
            },
            include: [
                {
                    model: repos,
                    required: true,
                    where: {
                        id: req.params.id,
                    },
                    attributes: [],
                },
            ],
        });
        if (commit) res.status(200).json(commit);
        else res.status(404).send("Commit is not found");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/api/repos/:id/commits", async (req, res) => {
    try {
        req.ability.throwUnlessCan("create", await repos.findByPk(Number(req.params.id)));
        const commit = await commits.create({
            message: req.body.message,
            repoId: req.params.id,
        });
        res.status(201).send(commit);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put("/api/repos/:id/commits/:commitId", async (req, res) => {
    try {
        req.ability.throwUnlessCan("update", await repos.findByPk(req.params.id));
        await commits.update(
            {
                message: req.body.message,
            },
            {
                where: {
                    id: req.params.commitId,
                },
                include: [
                    {
                        model: repos,
                        required: true,
                        where: {
                            id: req.params.id,
                        },
                        attributes: [],
                    },
                ],
            }
        );
        res.status(200).send("Commit is updated");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete("/api/repos/:id/commits/:commitId", async (req, res) => {
    try {
        req.ability.throwUnlessCan("manage", "all");
        await commits.destroy({
            where: {
                id: req.params.commitId,
            },
            include: [
                {
                    model: repos,
                    required: true,
                    where: {
                        id: req.params.id,
                    },
                    attributes: [],
                },
            ],
        });
        res.status(200).send("Commit is deleted");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.use((req, res, next) =>
{
   res.status(404).send('Incorrect Method or URL');
});

sequelize
    .sync()
    .then(() => {
        app.listen(3000, () =>
            console.log("Server is running on http://localhost:3000/")
        );
    })
    .catch((error) => console.log(error));

