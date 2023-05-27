const express = require('express');
const bodyParser = require('body-parser');
const {promisifyAll} = require('bluebird');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('23lab', 'sa', '12345', {host: '127.0.0.1', dialect: 'mssql'});
const {Users} = require('./23-02-model').ORM(sequelize);
const redis = require('redis');
const path = require("path");
const fs = require("fs");
const secret ='secret-key';

sequelize.authenticate()
    .then(() => {
        app.listen(3000, () => console.log(`http://localhost:3000/login`));
    })
    .catch(error => console.log(error));
const redisClient = redis.createClient();

const findUser = (username)=>{
    return Users.findOne({where: {username} });
}
const addUser=(user)=> {
    return Users.create(user);
}


const app = express();
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/resource', (req, res, next) => {
    const accessToken = req.cookies['access-token'];

    if (accessToken) {
        jwt.verify(accessToken, secret, (err, payload) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    res.redirect('/refresh-token');
                }
            } else if (payload) {
                req.payload = payload;
            }
        })
    }
    next();
});

app.get('/refresh-token', async (req, res) => {
    const refreshToken = req.cookies['refresh-token'];

    if (refreshToken) {
        let rc = null;
        await redisClient.get(refreshToken,        (_, resp) => {
            rc =resp;
            console.log("get:", resp)

        if (resp) {
            console.log(`refresh-токен "${refreshToken}" - в черном списке`);
            res.redirect('/login');
        } else {
            jwt.verify(refreshToken, secret, async (err, payload) => {
                if (err) {
                    res.status(401).send('no valid');
                    res.redirect('/login');
                } else if (payload) {
                    await redisClient.set(refreshToken, true);
                    res.cookie('access-token', jwt.sign({id: payload.id, username: payload.username}, secret,{expiresIn: '10m'}),{httpOnly: true, SameSite:'strict'} );
                    //тот параметр используется для предотвращения доступа клиентских скриптов к файлу cookie
                    //этот параметр указывает браузеру включать файл cookie только в запросы, исходящие из того же домена, что и веб-сайт или приложение, установившее файл cookie.
                    res.cookie('refresh-token', jwt.sign({id: payload.id, username: payload.username}, secret, {expiresIn: '24h'}),{ path:'/refresh-token'});
                    res.redirect('/resource');
                }
            });
        }});
    } else {
        res.redirect('/login');
    }
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res,) => {
    res.status(401);
    const rs = fs.ReadStream('./23-01.html');
    rs.pipe(res);
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await findUser(username);

    if (user?.password === password) {
        res.cookie('access-token', jwt.sign({id: user.id, username: user.username}, secret,{expiresIn: '10m'}), {httpOnly: true, SameSite:'strict'} );
        res.cookie('refresh-token', jwt.sign({id: user.id, username: user.username}, secret,{expiresIn:'24h'}), { path:'/refresh-token'});
        res.redirect('/resource');
    } else {

        res.redirect('/login');
    }
});

app.get('/register', (req, res) => {
    const rs = fs.ReadStream('./register.html');
    rs.pipe(res);
});

app.post('/register', async (req, res) => {
    const {username, password} = req.body;

    try {
        await addUser({username, password});
        res.redirect('/login');
    } catch (err) {
        res.send(err.message);
    }
});

app.get('/resource', (req, res) => {
    if (req.payload) {
        const rs = fs.ReadStream('./resource.html');
        rs.pipe(res);
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('access-token');
    res.clearCookie('refresh-token');
    res.redirect('/login');
})

app.use((req, res) => {
    res.status(404).send('Not Found');
})


