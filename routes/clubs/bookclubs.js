const express = require('express');
const router = express.Router();
const bookclubs = require('../../controllers/clubs/bookclubs');
const catchAsync = require('../../utils/catchAsync');
const { isLoggedIn, isAdmin, validateBookclub, isMember } = require('../../middleware');
const multer = require('multer');
const { storage } = require('../../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(isLoggedIn, catchAsync(bookclubs.index))
    .post(isLoggedIn, upload.single('club[picture]'), validateBookclub, catchAsync(bookclubs.createBookclub));

router.get('/new', isLoggedIn, bookclubs.renderNewForm);

router.route('/:id')
    .get(isLoggedIn, catchAsync(bookclubs.showBookclub))
    .put(isLoggedIn, isAdmin, validateBookclub, catchAsync(bookclubs.editBookclub))
    .delete(isLoggedIn, isAdmin, catchAsync(bookclubs.deleteBookclub));

router.post('/:id/search', isLoggedIn, isAdmin, catchAsync(bookclubs.searchBooks));

router.post('/:id/usersearch', isLoggedIn, isAdmin, catchAsync(bookclubs.searchUser));

router.post('/:id/inviteuser', isLoggedIn, isAdmin, catchAsync(bookclubs.inviteUser));

router.post('/:id/deleteinvite', isLoggedIn, isAdmin, catchAsync(bookclubs.deleteInvite));

router.post('/:id/removeUser', isLoggedIn, isAdmin, catchAsync(bookclubs.removeUser));

router.post('/:id/leaveclub', isLoggedIn, catchAsync(bookclubs.leaveClub));

router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(bookclubs.renderEditForm));



module.exports = router;
