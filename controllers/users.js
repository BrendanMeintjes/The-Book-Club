const { findById } = require('../models/user');
const User = require('../models/user');
const BookClub = require('../models/bookClub');
const Book = require('../models/book');
// const { unsubscribe } = require('../routes/users');


module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
};

module.exports.create = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const profilePicture = ({ url: req.file.path, filename: req.file.filename });
        const user = new User({ email, username, profilePicture });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to The Bookclub');
            res.redirect('/books/read');
        });
        console.log(req.file.path);

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', "Welcome back!");
    const redirectUrl = req.session.returnTo || '/home';
    delete req.session.returnTo;
    // Hi User.name, welcome back
    res.redirect(redirectUrl);
};


module.exports.logout = function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Successfully Logged Out!");
        res.redirect('/');
    });
};


module.exports.home = async (req, res) => {
    const user = await User.findById(req.user._id).populate('profilePicture').populate('invites').populate('friends', null, null, { sort: { username: 1 } }).populate('friendRequestsRecieved');
    const clubAdmin = await BookClub.find({ admin: req.user._id }).populate('admin').populate('books');
    const clubMember = await BookClub.find({ members: { $in: [req.user._id] } }).populate('admin').populate('books');
    const read = await Book.find({
        user: req.user._id,
        list: "read",
    }).populate('user');
    const wishlist = await Book.find({
        user: req.user._id,
        list: "wishlist",
    }).populate('user');
    res.render('users/home', { user, clubAdmin, clubMember, read, wishlist });
};



module.exports.searchUser = async (req, res, next) => {
    const name = req.body.usersearch;
    const user = await User.findById(req.user._id);
    const searches = await User.find({ username: { '$regex': name, $options: 'i' } });
    res.render('users/invite', { searches, user });
    console.log(user)
};

module.exports.removeFriend = async (req, res) => {
    const id = req.body.friendId
    await User.findByIdAndUpdate(req.user._id, { $pull: { friends: id } });
    await User.findByIdAndUpdate(id, { $pull: { friends: req.user._id } });
    req.flash('success', 'Removed!');
    res.redirect(`/home`);
}

