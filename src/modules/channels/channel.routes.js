const express = require('express');
const router = express.Router();
const channelController = require('./channel.controller');
const validate = require('../../middlewares/validation');
const { channelSchema } = require('./channel.validation');

// Create a new channel
router.post('/', validate(channelSchema.create), channelController.createChannel);

// Get all channels
router.get('/', channelController.getAllChannels);

// Get channel by ID
router.get('/:id', channelController.getChannelById);

// Get channel by code
router.get('/code/:code', channelController.getChannelByCode);

// Update channel
router.put('/:id', validate(channelSchema.update), channelController.updateChannel);

// Delete channel (soft delete)
router.delete('/:id', channelController.deleteChannel);

module.exports = router;
