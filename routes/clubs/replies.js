const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReply, isLoggedIn, isCommentAuthor } = require('../../middleware');
const catchAsync = require('../../utils/catchAsync');
const replies = require('../../controllers/clubs/replies');


router.post('/', isLoggedIn, validateReply, catchAsync(replies.createReply));

router.get('/reply/:replyId/edit', isLoggedIn, catchAsync(replies.renderReplyEditForm));

router.route('/reply/:replyId')
    .put(isLoggedIn, validateReply, catchAsync(replies.editReply))
    .delete(isLoggedIn, catchAsync(replies.deleteReply));

module.exports = router;