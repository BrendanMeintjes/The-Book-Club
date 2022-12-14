const Book = require('../models/book');
const BookClub = require('../models/bookClub');
const Comment = require('../models/comment');

module.exports.createComment = async (req, res) => {
    const { id, bookId} = req.params;
    console.log(bookId);
    const club = await BookClub.findById(id);
    const book = await Book.findById(bookId);
    const comment = new Comment(req.body.comment);
    book.comments.push(comment);
    comment.book = book;
    comment.bookclub = club
    comment.author = req.user._id;
    await comment.save();
    await book.save();
    req.flash('success', 'New comment posted!');
    res.redirect(`/bookclubs/${club._id}/books/${book._id}`);
};

module.exports.renderCommentEditForm = async (req, res) => {
    const { id, bookId, commentId } = req.params;
    const club = await BookClub.findById(id);
    const book = await Book.findById(bookId);
    const comment = await Comment.findById(commentId);
    res.render('bookclubs/comments/edit', { club, book, comment });
};

module.exports.editComment = async (req, res) => {
    const { id, bookId, commentId } = req.params;
    await Comment.findByIdAndUpdate(commentId, { ...req.body.comment });
    await Book.findByIdAndUpdate(bookId, { ...req.body.book });
    req.flash('success', 'Comment successfuly updated!');
    res.redirect(`/bookclubs/${id}/books/${bookId}`);
};

module.exports.deleteComment = async (req, res) => {
    const { id, bookId, commentId } = req.params;
    await Book.findByIdAndUpdate(bookId, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Comment deleted!');
    res.redirect(`/bookclubs/${id}/books/${bookId}`);
}