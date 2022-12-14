const User = require('../models/user');
const Notification = require('../models/notification');


module.exports.showNotifications = async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: 'notifications',
        populate: {
            path: 'sender',
        }
    }).populate({
        path: 'notifications',
        populate: {
            path: 'comment',
            populate: {
                path: 'bookclub',
            }
        }
    }).populate({
        path: 'notifications',
        populate: {
            path: 'comment',
            populate: {
                path: 'book'
            }
        }
    }).populate({
        path: 'notifications',
        populate: {
            path: 'reply',
            populate: {
                path: 'comment'
            }
        },
    }).populate({
        path: 'friendRequestsRecieved'
    }).populate({
        path: 'invites',
        populate: {
            path: 'admin'
        }
    })
    console.log(user);
    res.render('users/notifications', { user });
};

module.exports.delete = async (req, res) => {
    const { notificationId } = req.params;
    await Notification.findByIdAndDelete(notificationId);
    await User.findByIdAndUpdate(req.user._id, { $pull: { notifications: notificationId } })
    const user = await User.findById(req.user._id).populate({
        path: 'notifications',
        populate: {
            path: 'sender',
        }
    }).populate({
        path: 'notifications',
        populate: {
            path: 'comment',
            populate: {
                path: 'bookclub',
            }
        }
    }).populate({
        path: 'notifications',
        populate: {
            path: 'comment',
            populate: {
                path: 'book'
            }
        }
    }).populate({
        path: 'notifications',
        populate: {
            path: 'reply',
            populate: {
                path: 'comment'
            }
        },
    }).populate({
        path: 'friendRequestsRecieved'
    }).populate({
        path: 'invites',
        populate: {
            path: 'admin'
        }
    })
    res.render('users/notifications', { user });

};

module.exports.deleteAndView = async (req, res) => {
    const { notificationId } = req.params;
    const url = req.url
    const notification = await Notification.findById(notificationId).populate({
        path: 'comment',
        populate: {
            path: 'book'
        }
    }).populate({
        path: 'reply',
        populate: {
            path: 'comment',
            populate: {
                path: 'book'
            }
        }
    }).populate({
        path: 'comment',
        populate: {
            path: 'bookclub',
            populate: {
                path: 'books'
            }
        }
    });
    await Notification.findByIdAndDelete(notificationId);
    await User.findByIdAndUpdate(req.user._id, { $pull: { notifications: notificationId } });
    console.log(notification);

    if (notification.reply && notification.reply.comment.book.list === "read") {
        res.redirect(`../books/read/${notification.bookId}/#${notification.reply.comment._id}`);

    } else if (notification.comment && notification.comment.book.list === "read") {
        res.redirect(`../books/read/${notification.bookId}/#${notification.comment._id}`);

    } else if (notification.reply && notification.reply.comment.book.list === "wishlist") {
        res.redirect(`../books/wishlist/${notification.bookId}/#${notification.reply.comment._id}`);

    } else if (notification.comment && notification.comment.book.list === "wishlist") {
        res.redirect(`../books/wishlist/${notification.comment.bookclub}/#${notification.comment._id}`);

    } else if (notification.comment.bookclub && (notification.comment.book._id !== notification.comment.bookclub.books[0]._id)) {
        res.redirect(`/bookclubs/${notification.comment.bookclub._id}/books/${notification.comment.book._id}/#${notification.comment._id}`);

    } else if (notification.comment.bookclub && (notification.comment.book._id == notification.comment.bookclub.books[0]._id)) {
        res.redirect(`/bookclubs/${notification.comment.bookclub._id}/#${notification.comment._id}`);

    } else if (notification.comment.reply && notification.comment.bookclub && (notification.comment.book._id !== notification.comment.bookclub.books[0]._id)) {
        res.redirect(`/bookclubs/${notification.comment.bookclub._id}/books/${notification.comment.book._id}/#${notification.comment._id}`);

    } else if (notification.comment.reply && notification.comment.bookclub && (notification.comment.book._id == notification.comment.bookclub.books[0]._id)) {
        res.redirect(`/bookclubs/${notification.comment.bookclub._id}/#${notification.comment._id}`);
    }
};
