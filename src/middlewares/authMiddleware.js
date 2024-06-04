const jwt = require('jsonwebtoken');
const ResponseDto = require('../models/dto/response/ResponseDto');
const User = require('../models').User;

module.exports.requireAuth = async (req, res, next) => {

  try {
		const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    next();
  } catch (err) {
    res.status(401).json(new ResponseDto(false, null, "Not Authorized"));
		return
  }
};

module.exports.requireAuthAdmin = (req, res, next) => {
		try{
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
		
			if (decoded.roles && decoded.roles.includes('ADMIN')) {
				next();
			} else {
				res.status(403).json({ error: 'Forbidden' });
				return 
			}
		} catch(err){
			res.status(500).json(new ResponseDto(false, null, "Something went wrong"))
		}
  };