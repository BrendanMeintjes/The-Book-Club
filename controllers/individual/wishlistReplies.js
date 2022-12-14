const Book = require('../../models/book');
const Comment = require('../../models/comment');
const Reply = require('../../models/reply');

module.exports.createReply = async (req, res) => {
    const { bookId, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    const reply = new Reply(req.body.reply);
    const user = await User.findById(comment.author);
    comment.replies.push(reply);
    reply.author = req.user._id;

    if (!comment.author.equals(req.user._id)) {
        const notify = new Notification();
        notify.sender = req.user._id;
        notify.user = comment.author;
        notify.bookId = bookId;
        notify.reply = reply;

        user.notifications.unshift(notify);
        await notify.save();
    };

    await comment.save();
    await reply.save();
    await user.save();
    req.flash('success', 'Reply posted!');
    res.redirect(`/books/wishlist/${bookId}/#${comment._id}`);
};

module.exports.renderReplyEditForm = async (req, res) => {
    const { bookId, commentId } = req.params;
    const book = await Book.findById(bookId);
    const comment = await Comment.findById(commentId);
    res.render('books/wishlist/comments/edit', { book, comment });
};

module.exports.editReply = async (req, res) => {
    const { bookId, commentId } = req.params;
    await Comment.findByIdAndUpdate(commentId, { ...req.body.comment });
    await Book.findByIdAndUpdate(bookId, { ...req.body.book });
    req.flash('success', 'Comment successfuly updated!');
    res.redirect(`/books/wishlist${bookId}`);
};

module.exports.deleteReply = async (req, res) => {
    const { id, bookId, commentId } = req.params;
    await Book.findByIdAndUpdate(bookId, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Comment deleted!');
    res.redirect(`/books/wishlist/${bookId}`);
}