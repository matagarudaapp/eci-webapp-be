require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models').User;
const Role = require('../models').Role;

class AuthService {
  constructor(userModel, roleModel) {
    this.userModel = userModel;
    this.roleModel = roleModel;
  }

  async signUpCreateUser(name, email, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({ name: name, email: email, password: hashedPassword });
    const userRole = await this.roleModel.findOne({ where: { name: role } });
    await user.addRole(userRole);
    return user;
  }

  async login(email, password){
    // Find the user by email
    const user = await this.userModel.findOne({ where: { email } });

    // If the user was not found, throw an error
    if (!user) {
      throw new Error('User not found');
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);

    // If the password is incorrect, throw an error
    if (!isMatch) {
      throw new Error('Invalid password');
    }

    // Get the user's roles
    const roles = await user.getRoles();
    const roleNames = roles.map(role => role.name);

    // Generate a JWT
    const token = jwt.sign({ id: user.id , name: user.name, roles: roleNames}, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Return the token
    return token;
  }
}

module.exports = new AuthService(User, Role); // Singleton instance