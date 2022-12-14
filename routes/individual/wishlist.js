const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../../utils/catchAsync');
const wishlist = require('../../controllers/individual/wishlist');
const { isLoggedIn } = require('../../middleware');


router.route('/')
    .get(isLoggedIn, catchAsync(wishlist.findBooks))
    .post(isLoggedIn, catchAsync(wishlist.createBooks));

router.post('/changetoread', isLoggedIn, catchAsync(wishlist.changeToRead));

router.route('/:id')
    .get(isLoggedIn, catchAsync(wishlist.showBooks))
    .delete(isLoggedIn, catchAsync(wishlist.deleteBook));

module.exports = router;