// const req = require("express/lib/request");

const { bookclubValidationSchema, commentValidationSchema, replyValidationSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const BookClub = require('./models/bookClub');
const Comment = require('./models/comment');
const User = require('./models/user');



module.exports.isLoggedIn = (req, res, next) => {
    console.log("REQ.USER...", req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in to do that');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateBookclub = (req, res, next) => {
    const { error } = bookclubValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAdmin = async (req, res, next) => {
    const { id } = req.params;
    const club = await BookClub.findById(id);
    if (!club.admin.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/bookclubs/${id}`);
    }
    next();
}

module.exports.isMember = async (req, res, next) => {
    const { id } = req.params;
    const club = await BookClub.findById(id);
    if (!club.member.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect('/');
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, bookId, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/bookclubs/${id}/books/${bookId}`);
    }
    next();
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.validateReply = (req, res, next) => {
    const { error } = replyValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};