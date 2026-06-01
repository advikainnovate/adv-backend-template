const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { validateAccessToken, validationMiddleware } = require('../../middlewares');
const { CONSTANTS } = require('../../config');
const { userSchema } = require('./user.validation');

router.post(
    '/register',
    //  validateAccessToken([CONSTANTS.ROLE.ADMIN]),
    validationMiddleware(userSchema.register),
    userController.register
);
router.post(
    '/:userId/avatarRegister',
    // validateAccessToken([CONSTANTS.ROLE.ADMIN]),
    validationMiddleware(userSchema.profileRegister),
    userController.profileRegister
);

router.get('/dashboard', validateAccessToken([CONSTANTS.ROLE.ADMIN]), userController.getDashboard);
router.get('/profile', validateAccessToken([CONSTANTS.ROLE.ADMIN]), userController.profile);
router.get('/all', validateAccessToken([CONSTANTS.ROLE.ADMIN]), userController.getAllUsers);
router.get('/all/dropdown', validateAccessToken([CONSTANTS.ROLE.ADMIN]), userController.getAllUserDropdown);
router.get('/:id/view', validateAccessToken([CONSTANTS.ROLE.ADMIN]), userController.findUser);
router.put(
    '/:id/changePassword',
    // validateAccessToken([CONSTANTS.ROLE.ADMIN]),
    validationMiddleware(userSchema.changePassword),
    userController.changePassword
);

router.post(
    '/check/displayName',
    validateAccessToken([CONSTANTS.ROLE.ADMIN]),
    validationMiddleware(userSchema.findDisplayName),
    userController.checkDisplayName
);
router.patch(
    '/:id/update',
    validateAccessToken([CONSTANTS.ROLE.ADMIN]),
    validationMiddleware(userSchema.update),
    userController.updateUser
);

router.patch(
    '/:id/updateStatus',
    validateAccessToken([CONSTANTS.ROLE.ADMIN]),
    validationMiddleware(userSchema.updateStatus),
    userController.updateUser
);

router.delete('/:id/delete', validateAccessToken([CONSTANTS.ROLE.ADMIN]), userController.deleteUser);

module.exports = router;
