const Sequelize = require('sequelize');
const {where} = require("sequelize");
const Model = Sequelize.Model;

class users extends Model {
};
class repos extends Model {}
class commits extends Model {}
function internalORM(sequelize) {
    users.init(
        {
            id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
            username: {type: Sequelize.STRING, allowNull: false},
            email: {type: Sequelize.STRING, allowNull: false},
            password: {type: Sequelize.STRING, allowNull: false},
            role: {type: Sequelize.STRING, allowNull: false},
        },
        {sequelize, tableName: 'users', timestamps: false}
    );
    repos.init(
        {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: Sequelize.STRING, allowNull: false },
            authorId: { type: Sequelize.INTEGER, allowNull: false },
        },
        { sequelize, tableName: "repos", timestamps: false }
    );
    commits.init(
        {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            message: { type: Sequelize.STRING, allowNull: false },
            repoId: { type: Sequelize.INTEGER, allowNull: false },
        },
        { sequelize, tableName: "commits", timestamps: false }
    );
}

exports.ORM = (s) => {
    internalORM(s);
    return {users, repos, commits};
}