const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/history/:alumniId', isAuthenticated, historyController.getHistoryByAlumniId);
router.post('/history', isAuthenticated, historyController.addHistoryEntry);

module.exports = router;
