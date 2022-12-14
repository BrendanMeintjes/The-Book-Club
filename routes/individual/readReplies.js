const express = require('express');
const router = express.Router({ mergeParams: true});
const { validateReply, isLoggedIn, isCommentAuthor } = require('../../middleware');
const catchAsync = require('../../utils/catchAsync');
const replies = require('../../controllers/individual/readReplies');


router.post('/', isLoggedIn, validateReply, catchAsync(replies.createReply));

router.get('/:replyId/edit', isLoggedIn, catchAsync(replies.renderReplyEditForm));

router.route('/:replyId')
    .put(isLoggedIn, isCommentAuthor, validateReply, catchAsync(replies.editReply))
    .delete(isLoggedIn, isCommentAuthor, catchAsync(replies.deleteReply));

module.exports = router;