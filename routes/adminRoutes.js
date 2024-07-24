const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

//isAuthenticated hanya mengecek apakah pengguna mempunyai akses untuk masuk kedalam sistem atau tidak
//isAdmin akan melakukan pengecekan lebih terhadap role pengguna apakah role pengguna tersebut merupakan admin
router.post('/importAlumniData', isAuthenticated, isAdmin, adminController.importAlumniData);
router.get('/manageAlumniData', isAuthenticated, isAdmin, adminController.manageAlumniData);
router.post('/createReport', isAuthenticated, isAdmin, adminController.createReport);
router.get('/viewAlumniDetails/:id', isAuthenticated, isAdmin, adminController.viewAlumniDetails);
router.post('/addAlumniData', isAuthenticated, isAdmin, adminController.addAlumniData);
router.put('/updateAlumniData/:id', isAuthenticated, isAdmin, adminController.updateAlumniData);
router.delete('/deleteAlumniData/:id', isAuthenticated, isAdmin, adminController.deleteAlumniData);

module.exports = router;
