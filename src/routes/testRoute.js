const { Router } = require('express');
const testController = require('../controllers/testContoller');

const router = Router();

router.get('/test', testController.test);

module.exports = router;