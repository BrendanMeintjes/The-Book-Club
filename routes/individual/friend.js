const express = require('express');
const router = express.Router({ mergeParams: true});
const catchAsync = require('../../utils/catchAsync');
const friend = require('../../controllers/individual/friend');
const { isLoggedIn } = require('../../middleware');


router.get('/:id', catchAsync(friend.viewProfile))
    

module.exports = router;