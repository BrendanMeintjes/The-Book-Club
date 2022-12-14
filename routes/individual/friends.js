const express = require('express');
const router = express.Router({ mergeParams: true});
const catchAsync = require('../../utils/catchAsync');
const friends = require('../../controllers/individual/friends');
const { isLoggedIn } = require('../../middleware');


router.get('/', catchAsync(friends.friends))
    

module.exports = router;