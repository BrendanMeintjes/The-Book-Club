const Book = require('../../models/book');
const BookClub = require('../../models/bookClub');
const Comment = require('../../models/comment');
const Reply = require('../../models/reply');

module.exports.createReply = async (req, res) => {
    const { id, bookId, commentId } = req.params;
    const club = await BookClub.findById(id);
    const book = await Book.findById(bookId);
    const comment = await Comment.findById(commentId);
    const reply = new Reply(req.body.reply);
    comment.replies.push(reply);
    reply.comment = comment;
    reply.book = book;
    reply.bookclub = club
    reply.author = req.user._id;
    await comment.save();
    await book.save();
    await club.save();
    await reply.save();
    req.flash('success', 'Reply posted!');
    res.redirect(`/bookclubs/${club._id}/books/${book._id}`);
};

module.exports.renderReplyEditForm = async (req, res) => {
    const { id, bookId, commentId } = req.params;
    const club = await BookClub.findById(id);
    const book = await Book.findById(bookId);
    const comment = await Comment.findById(commentId);
    res.render('bookclubs/comments/edit', { club, book, comment });
};

module.exports.editReply = async (req, res) => {
    const { id, bookId, commentId, replyId } = req.params;
    await Reply.findByIdAndUpdate(replyId, { ...req.body.reply });
    await Book.findByIdAndUpdate(bookId, { ...req.body.book });
    req.flash('success', 'Comment successfuly updated!');
    res.redirect(`/bookclubs/${id}/books/${bookId}`);
};

module.exports.deleteReply = async (req, res) => {
    const { id, bookId, commentId, replyId } = req.params;
    await Reply.findByIdAndDelete(replyId);
    req.flash('success', 'Reply deleted!');
    res.redirect(`/bookclubs/${id}/books/${bookId}`);
}