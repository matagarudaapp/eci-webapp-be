const ResponseDto = require('../models/dto/response/ResponseDto');
const dashboardService = require('../services/dashboardService');

module.exports.dashboard_get = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const data = await dashboardService.getDashboardUserDataFromCsv(decoded.id, decoded.roles);
        return res.status(200).json(new ResponseDto(true, data, 'Success'));
    } catch (error) {     
        return res.status(500).json(new ResponseDto(false, null, error.message));
    }
}