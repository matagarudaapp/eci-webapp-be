const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/eci-webapp');
const User = require("./User")(sequelize, DataTypes)
const Role = require("./Role")(sequelize, DataTypes)
require('./associations').init(User, Role)

module.exports = {User, Role, sequelize};