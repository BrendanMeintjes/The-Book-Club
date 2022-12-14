const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateComment, isLoggedIn, isCommentAuthor } = require('../../middleware');
const catchAsync = require('../../utils/catchAsync');
const comments = require('../../controllers/individual/readComments');


router.post('/', isLoggedIn, validateComment, catchAsync(comments.createReadComment));

router.get('/:commentId/edit', isLoggedIn, catchAsync(comments.renderCommentEditForm));

router.route('/:commentId')
    .put(isLoggedIn, isCommentAuthor, validateComment, catchAsync(comments.editComment))
    .delete(isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment));


module.exports = router;