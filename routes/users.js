const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const user = require('../controllers/users');
const { isLoggedIn } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/home', isLoggedIn, catchAsync(user.home))

router.route('/register')
    .get(user.renderRegisterForm)
    .post(upload.single('profilePicture'), catchAsync(user.create));

router.route('/login')
    .get(user.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login);

router.get('/logout', isLoggedIn, (user.logout))

router.post('/searchuser', isLoggedIn, catchAsync(user.searchUser))

router.post('/removefriend', isLoggedIn, catchAsync(user.removeFriend))

module.exports = router;