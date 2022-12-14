const Book = require('../../models/book');
const Comment = require('../../models/comment');

module.exports.createWishlistComment = async (req, res) => {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    const user = await User.findById(book.user);
    const comment = new Comment(req.body.comment);
    book.comments.push(comment);
    comment.book = book;
    comment.author = req.user._id;

    if (!book.user.equals(req.user._id)) {
        const notify = new Notification();
        notify.sender = req.user._id;
        notify.user = book.user;
        notify.bookId = bookId;
        notify.comment = comment
        user.notifications.unshift(notify);
        await notify.save();
    };
    await comment.save();
    await book.save();
    await user.save();
    req.flash('success', 'New comment posted!');
    res.redirect(`/books/wishlist/${book._id}/#${comment._id}`);
};

module.exports.renderCommentEditForm = async (req, res) => {
    const { bookId, commentId } = req.params;
    const book = await Book.findById(bookId);
    const comment = await Comment.findById(commentId);
    res.render('books/comments/edit', { book, comment });
};

module.exports.editComment = async (req, res) => {
    const { bookId, commentId } = req.params;
    await Comment.findByIdAndUpdate(commentId, { ...req.body.comment });
    await Book.findByIdAndUpdate(bookId, { ...req.body.book });
    req.flash('success', 'Comment successfuly updated!');
    res.redirect(`/books/wishlist/${bookId}`);
};

module.exports.deleteComment = async (req, res) => {
    const { bookId, commentId } = req.params;
    await Book.findByIdAndUpdate(bookId, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Comment deleted!');
    res.redirect(`/books/wishlist/${bookId}`);
}