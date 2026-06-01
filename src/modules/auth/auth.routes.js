const express = require('express');
const authController = require('./auth.controller');
const { validationMiddleware, validateAccessToken } = require('../../middlewares');
const { authSchema } = require('./auth.validation');
const { CONSTANTS } = require('../../config');
const router = express.Router();

router.post('/login', validationMiddleware(authSchema.login), authController.login);
router.post('/forget-password', validationMiddleware(authSchema.forgetPassword), authController.forgetPassword);
router.post('/reset-password', validationMiddleware(authSchema.resetPassword), authController.resetPassword);

router.post(
    '/logout',
    validateAccessToken([CONSTANTS.ROLE.ADMIN]),
    authController.logoutUser
);

module.exports = router;
