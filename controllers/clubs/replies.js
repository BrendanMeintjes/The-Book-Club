const Book = require('../../models/book');
const BookClub = require('../../models/bookClub');
const Comment = require('../../models/comment');
const Reply = require('../../models/reply');
const Notification = require('../../models/notification')
const User = require('../../models/user')

module.exports.createReply = async (req, res) => {
    const { id, bookId, commentId } = req.params;
    const club = await BookClub.findById(id).populate({
        path: 'books', options: { sort: { 'createdAt': -1 } }
    });
    const book = await Book.findById(bookId);
    const comment = await Comment.findById(commentId).populate('author');
    const reply = new Reply(req.body.reply);
    const user = await User.findById(comment.author);
    comment.replies.push(reply);
    reply.comment = comment;
    reply.book = book;
    reply.bookclub = club
    reply.author = req.user._id;

    if (!comment.author.equals(req.user._id)) {
        const notify = new Notification();
        notify.sender = req.user._id;
        notify.user = comment.author;
        notify.bookId = bookId;
        notify.reply = reply;
        notify.comment = comment;
        notify.club = club;
        user.notifications.unshift(notify);
        await notify.save();
        await user.save();

    };

    await comment.save();
    await reply.save();
    req.flash('success', 'Reply posted!');

    if (bookId == club.books[0]._id) {
        res.redirect(`/bookclubs/${club._id}/#${comment._id}`)
    } else {
        res.redirect(`/bookclubs/${club._id}/books/${book._id}/#${comment._id}`);
    };
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
    const club = await BookClub.findById(id).populate({
        path: 'books', options: { sort: { 'createdAt': -1 } }
    });
    await Reply.findByIdAndUpdate(replyId, { ...req.body.reply });
    req.flash('success', 'Comment successfuly updated!');
    if (bookId == club.books[0]._id) {
        res.redirect(`/bookclubs/${club._id}/#${commentId}`)
    } else {
        res.redirect(`/bookclubs/${club._id}/books/${bookId}/#${commentId}`);
    };
};

module.exports.deleteReply = async (req, res) => {
    const { id, bookId, commentId, replyId } = req.params;
    await Book.findById(bookId);
    await Comment.findByIdAndUpdate(commentId, { $pull: { replies: replyId } });
    await Reply.findByIdAndDelete(replyId);
    req.flash('success', 'Reply deleted!');
    if (bookId == club.books[0]._id) {
        res.redirect(`/bookclubs/${id}`);
    } else {
        res.redirect(`/bookclubs/${id}/books/${bookId}`);
    }
}