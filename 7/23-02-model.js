const Sequelize = require('sequelize');
const {where} = require("sequelize");
const Model = Sequelize.Model;

class Users extends Model {
};

function internalORM(sequelize) {

    Users.init({
        Id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
        username: {type: Sequelize.STRING, allowNull: false},
        password: {type: Sequelize.STRING, allowNull: false}
    }, {sequelize,
        tableName: 'Users', timestamps: false
    })};
exports.ORM = (s) => {
    internalORM(s);
    return {Users};
}