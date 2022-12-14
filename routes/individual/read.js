const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../../utils/catchAsync');
const read = require('../../controllers/individual/read');
const { isLoggedIn } = require('../../middleware');


router.route('/')
    .get(isLoggedIn, catchAsync(read.findBooks))
    .post(catchAsync(read.createBook));

router.post('/changetowishlist', isLoggedIn, catchAsync(read.changeToWishlist));

router.route('/:id')
    .get(catchAsync(read.showBooks))
    .delete(catchAsync(read.deleteBook));

module.exports = router;
