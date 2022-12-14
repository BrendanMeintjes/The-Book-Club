const User = require('../../models/user');
const Book = require('../../models/book');


module.exports.viewProfile = async (req, res) => {
    const { id } = req.params
    const friend = await User.findById(id);
    const read = await Book.find({ user: id, list: "read" }).populate('comments');
    const wishlist = await Book.find({ user: id, list: "wishlist" }).populate('comments');
    res.render('users/friend', { friend, read, wishlist });
};
