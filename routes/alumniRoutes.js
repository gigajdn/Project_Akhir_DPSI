const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');
const { isAuthenticated, isAlumni } = require('../middlewares/authMiddleware');

//isAuthenticated hanya mengecek apakah pengguna mempunyai akses untuk masuk kedalam sistem atau tidak
//isAdmin akan melakukan pengecekan lebih terhadap role pengguna apakah role pengguna tersebut merupakan alumni
router.get('/profile/:id', isAuthenticated, isAlumni, alumniController.viewProfile);
router.put('/profile/:id', isAuthenticated, isAlumni, alumniController.updateProfile);
router.get('/accessAlumniInfo', isAuthenticated, isAlumni, alumniController.accessAlumniInfo);
router.post('/searchAlumni', isAuthenticated, isAlumni, alumniController.searchAlumni);
router.get('/viewAlumniDetails/:id', isAuthenticated, isAlumni, alumniController.viewAlumniDetails);
router.post('/chatBetweenAlumni', isAuthenticated, isAlumni, alumniController.chatBetweenAlumni);

module.exports = router;
