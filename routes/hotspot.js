const express = require('express');
const router = express.Router();
const hotspotController = require('../controllers/hotspotController');

// 주소와 로직 연결
router.get('/test/:placeName', hotspotController.getHotspotInfo);

module.exports = router;