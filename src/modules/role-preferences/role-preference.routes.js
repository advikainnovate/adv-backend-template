const express = require('express');
const router = express.Router();
const rolePreferenceController = require('./role-preference.controller');
const validate = require('../../middlewares/validation');
const { rolePreferenceSchema } = require('./role-preference.validation');

// Create a new preference
router.post('/', validate(rolePreferenceSchema.create), rolePreferenceController.createPreference);

// Bulk create/update role defaults
router.post('/bulk', validate(rolePreferenceSchema.bulkCreate), rolePreferenceController.bulkCreatePreferences);

// Get all preferences (with filters)
router.get('/', rolePreferenceController.getAllPreferences);

// Get all preferences for a specific role
router.get('/role/:userType', rolePreferenceController.getRolePreferences);

// Get preference by ID
router.get('/:id', rolePreferenceController.getPreferenceById);

// Update preference
router.put('/:id', validate(rolePreferenceSchema.update), rolePreferenceController.updatePreference);

// Delete preference (soft delete)
router.delete('/:id', rolePreferenceController.deletePreference);

module.exports = router;
