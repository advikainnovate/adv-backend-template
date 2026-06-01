const express = require('express');
const router = express.Router();
const controller = require('./notification-queue-sqs.controller');
const validate = require('../../middlewares/validation');
const { queueSchema } = require('./notification-queue-sqs.validation');

// Create a new queue
router.post('/', validate(queueSchema.create), controller.createQueue);

// Get all queues
router.get('/', controller.getAllQueues);

// Get queue by code
router.get('/code/:code', controller.getQueueByCode);

// Get queue by ID
router.get('/:id', controller.getQueueById);

// Update queue
router.put('/:id', validate(queueSchema.update), controller.updateQueue);

// Delete queue (soft delete)
router.delete('/:id', controller.deleteQueue);

module.exports = router;
