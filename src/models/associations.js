module.exports.init = (User, Role) => {
    User.belongsToMany(Role, { through: 'UserRoles' });
    Role.belongsToMany(User, { through: 'UserRoles' });
}

