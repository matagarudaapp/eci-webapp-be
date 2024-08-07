const { Router } = require('express');
const forgotPasswordController = require('../controllers/forgotPasswordController');

const router = Router();

router.get('/:forgotPasswordUrlUuid', forgotPasswordController.forgotPassword_get);
router.post('/:forgotPasswordUrlUuid', forgotPasswordController.forgotPassword_post);
router.post('', forgotPasswordController.forgotPasswordSendEmail_post)

module.exports = router;
