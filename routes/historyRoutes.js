const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

//isAuthenticated hanya mengecek apakah pengguna mempunyai akses untuk masuk kedalam sistem atau tidak
router.get('/history/:alumniId', isAuthenticated, historyController.getHistoryByAlumniId);
router.post('/history', isAuthenticated, historyController.addHistoryEntry);

module.exports = router;
