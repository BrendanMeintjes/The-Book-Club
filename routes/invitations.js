const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const invitations = require('../controllers/invitations');
const { isLoggedIn } = require('../middleware');

router.post('/sendfriendrequest', isLoggedIn, catchAsync (invitations.sendFriendRequest))

router.post('/addfriend', isLoggedIn, catchAsync (invitations.addFriend))

router.post('/declinefriendrequest', isLoggedIn, catchAsync (invitations.declineFriendRequest))

router.post('/cancelfriendrequest', isLoggedIn, catchAsync (invitations.cancelFriendRequest))

router.post('/deletefriend', isLoggedIn, catchAsync (invitations.deleteFriend))

router.post('/joinclub', isLoggedIn, catchAsync (invitations.acceptClubInvite))

router.post('/rejectclub',isLoggedIn, catchAsync (invitations.rejectClubInvite))

module.exports = router;