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

  async forgotPasswordGet(forgotPasswordUrlUuid){
    const user = await User.findOne({ where: { forgotPasswordUrlUuid } });

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    if (!user) {
      throw new Error('Link is invalid');
    }

    if(user.forgotPasswordRequestedAt && user.forgotPasswordRequestedAt < oneHourAgo){
      user.forgotPasswordUrlUuid = null;
      user.forgotPasswordRequestedAt = null;
      user.save();
      throw new Error('Link is invalid or outdated');
    }


    return { message: 'Success'};
  }

  async forgotPasswordPost(forgotPasswordUrlUuid, reqBody){
    const user = await this.userModel.findOne({ where: { forgotPasswordUrlUuid } });

    // If the user was not found, throw an error
    if (!user) {
      throw new Error('User not found');
    }

    const hashedNewPassword = await bcrypt.hash(reqBody.newPassword, 10);
    user.password = hashedNewPassword;
    user.forgotPasswordUrlUuid = null;
    user.forgotPasswordRequestedAt = null;
    user.save();

    return { message: 'Success'};
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