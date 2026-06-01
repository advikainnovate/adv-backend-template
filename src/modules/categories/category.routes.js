const express = require('express');
const router = express.Router();
const categoryController = require('./category.controller');
const validate = require('../../middlewares/validation');
const { categorySchema } = require('./category.validation');

// Create a new category
router.post('/', validate(categorySchema.create), categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by ID
router.get('/:id', categoryController.getCategoryById);

// Get category by code
router.get('/code/:code', categoryController.getCategoryByCode);

// Update category
router.put('/:id', validate(categorySchema.update), categoryController.updateCategory);

// Delete category (soft delete)
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
