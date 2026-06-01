const express = require('express');
const router = express.Router();
const templateController = require('./template.controller');
const validate = require('../../middlewares/validation');
const { templateSchema } = require('./template.validation');

// Create a new template
router.post('/', validate(templateSchema.create), templateController.createTemplate);

// Get all templates
router.get('/', templateController.getAllTemplates);

// Get template by ID
router.get('/:id', templateController.getTemplateById);

// Get template by code
router.get('/code/:code', templateController.getTemplateByCode);

// Update template
router.put('/:id', validate(templateSchema.update), templateController.updateTemplate);

// Delete template (soft delete)
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;
