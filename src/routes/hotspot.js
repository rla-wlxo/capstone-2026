const express = require('express');
const router = express.Router();
const hotspotController = require('../controllers/hotspotController');

// 주소와 로직 연결
router.get('/recommend', hotspotController.getNearbyHotspots);
router.get('/test/:placeName', hotspotController.getHotspotInfo);
router.get('/apitest/:placeName', hotspotController.apitest);
module.exports = router;