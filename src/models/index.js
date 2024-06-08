const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URL);
const User = require("./User")(sequelize, DataTypes);
const Role = require("./Role")(sequelize, DataTypes);
const VideoResult = require("./VideoResult")(sequelize, DataTypes);
require("./associations").init(User, Role, VideoResult);

module.exports = { User, Role, VideoResult, sequelize };
