const User = require('../../models/user');

module.exports.friends = async (req, res) => {
    const user = await User.findById(req.user._id).populate('friends');
    res.render('users/friends', { user });
};
