const express = require('express');
const router = express.Router();

const userRoutes = require('../modules/users/user.routes');

router.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Service is healthy', timestamp: new Date().toISOString() });
});

router.use('/users', userRoutes);

module.exports = router;
