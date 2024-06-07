module.exports.init = (User, Role, VideoResult) => {
    User.belongsToMany(Role, { through: 'UserRoles' });
    Role.belongsToMany(User, { through: 'UserRoles' });
    VideoResult.belongsTo(User, { foreignKey: 'userId' });
}

