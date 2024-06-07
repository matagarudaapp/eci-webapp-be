const ResponseDto = require('../models/dto/response/ResponseDto');
const userDtoSchema = require('../validations/UserDtoSchema');
const AuthService = require('../services/authService');

module.exports.signup_post = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate the UserDto
  const { error } = userDtoSchema.validate({ name, email, password, role });
  if (error) {
    return res.status(400).json(new ResponseDto(false, null, error.details[0].message));
  }

  try {
    // Create a new UserDto
    //const userDto = new UserDto(name, email, password);

    await AuthService.signUpCreateUser(name, email, password, role);

    res.status(201).json(new ResponseDto(true, null, 'User created successfully'));
  } catch (error) {
    console.log(error)
    if(error.name == 'SequelizeUniqueConstraintError'){
        res.status(400).json(new ResponseDto(false, null, "Email already been used"));
        return;
    }
    res.status(400).json(new ResponseDto(false, null, 'Failed to create user'));
  }
};

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;
    // Validate the UserDto
    const { error } = userDtoSchema.validate({ email, password });
    if (error) {
      return res.status(400).json(new ResponseDto(false, null, error.details[0].message));
    }

    try {
      const token =  await AuthService.login(email, password)
    	res.status(200).json(new ResponseDto(true, {token: token}, "Login success"))
    } catch (error) {
      res.status(400).json(new ResponseDto(false, null, error.message));
    }
}