const express = require('express');
const { planTrip } = require('../controllers/tripController');

const router = express.Router();
router.post('/', planTrip);

module.exports = router;