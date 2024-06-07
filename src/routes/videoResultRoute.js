const { Router } = require('express');
const videoResultController = require('../controllers/videoResultController');

const router = Router();

router.get('/videoResults', videoResultController.videoResults_get);
router.get('/videoResults/:id', videoResultController.videoResult_get);

module.exports = router;