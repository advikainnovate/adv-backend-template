const express = require('express');
const router = express.Router();
const userPreferenceController = require('./user-preference.controller');
const validate = require('../../middlewares/validation');
const { userPreferenceSchema } = require('./user-preference.validation');

const { optionalAuth } = require('../../middlewares/authorisation');

// Create a new preference
router.post('/', validate(userPreferenceSchema.create), userPreferenceController.createPreference);

// Generate preferences for a user
router.post('/generate', optionalAuth, userPreferenceController.generatePreferences);
router.post('/generate/:userId', optionalAuth, userPreferenceController.generatePreferences);

// Get all preferences (with filters)
router.get('/', userPreferenceController.getAllPreferences);

// Check if notification is enabled for user
router.get('/check', userPreferenceController.checkPreference);

// Get all preferences for a specific user
router.get('/user/:userId/:userType', userPreferenceController.getUserPreferences);

// Get preference by ID
router.get('/:id', userPreferenceController.getPreferenceById);

// Update preference
router.put('/:id', validate(userPreferenceSchema.update), userPreferenceController.updatePreference);

// Delete preference (soft delete)
router.delete('/:id', userPreferenceController.deletePreference);

module.exports = router;
