const Book = require('../../models/book');
const BookClub = require('../../models/bookClub');
const Comment = require('../../models/comment');
const Notification = require('../../models/notification')
const User = require('../../models/user')

module.exports.createComment = async (req, res) => {
    const { id, bookId } = req.params;
    const club = await BookClub.findById(id).populate({
        path: 'books', options: { sort: { 'createdAt': -1 } }
    });
    const admin = await User.findById(club.admin)
    const book = await Book.findById(bookId);
    const comment = new Comment(req.body.comment);
    book.comments.push(comment);
    comment.book = book;
    comment.bookclub = club;
    comment.author = req.user._id;

    if (!club.admin.equals(req.user._id)) {
        const notify = new Notification();
        notify.sender = req.user._id;
        notify.user = admin;
        notify.bookId = bookId;
        notify.comment = comment;
        notify.club = club;
        admin.notifications.unshift(notify);
        await notify.save();
        await admin.save();
    };

    await comment.save();
    await book.save();
    await club.save();
    req.flash('success', 'New comment posted!');
    if (bookId == club.books[0]._id) {
        res.redirect(`/bookclubs/${club._id}/#${comment._id}`);

    } else {
        res.redirect(`/bookclubs/${club._id}/books/${book._id}/#${comment._id}`)

    };
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
    if (bookId == parseIntclub.books[0]._id) {
        res.redirect(`/bookclubs/${club._id}`)
    } else {
        res.redirect(`/bookclubs/${id}/books/${bookId}`);

    };
};

module.exports.deleteComment = async (req, res) => {
    const { id, bookId, commentId } = req.params;
    const club = await BookClub.findById(id).populate({
        path: 'books', options: { sort: { 'createdAt': -1 } }
    });
    await Book.findByIdAndUpdate(bookId, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Comment deleted!');
    if (bookId == club.books[0]._id) {
        res.redirect(`/bookclubs/${club._id}`);
    } else {
        res.redirect(`/bookclubs/${id}/books/${bookId}`);

    };
}