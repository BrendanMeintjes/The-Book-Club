const User = require('../models/user');
const BookClub = require('../models/bookClub');


module.exports.showInvitations = async (req, res) => {
    const user = await User.findById(req.user._id).populate('friendRequestsRecieved').populate('invites')
    res.render('users/requests', { user });
};

module.exports.sendFriendRequest = async (req, res, next) => {
    const userId = req.user._id
    const friendId = req.body.friend;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    user.friendRequestsSent.push(friendId);
    await user.save();
    friend.friendRequestsRecieved.push(userId);
    await friend.save();
    req.flash('success', `Friend request sent to ${friend.username}`);
    res.redirect('/home');
};

module.exports.addFriend = async (req, res, next) => {
    const userId = req.user._id
    const friendId = req.body.friend;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    user.friends.push(friendId);
    await user.save();
    friend.friends.push(userId);
    await friend.save();
    await User.findByIdAndUpdate(userId, { $pull: { friendRequestsRecieved: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friendRequestsSent: userId } });
    res.redirect('/home');
};

module.exports.declineFriendRequest = async (req, res, next) => {
    const userId = req.user._id
    const friendId = req.body.friend;
    await User.findByIdAndUpdate(userId, { $pull: { friendRequestsRecieved: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friendRequestsSent: userId } });
    res.redirect('/home');
};


module.exports.cancelFriendRequest = async (req, res, next) => {
    const userId = req.user._id
    const friendId = req.body.friend;
    await User.findByIdAndUpdate(userId, { $pull: { friendRequestsSent: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friendRequestsRecieved: userId } });
    res.redirect('/home');
};

module.exports.deleteFriend = async (req, res, next) => {
    const userId = req.user._id
    const friendId = req.body.friend;
    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });
    res.redirect('/home');
};

module.exports.acceptClubInvite = async (req, res, next) => {
    const userId = req.user._id;
    const clubId = req.body.club;
    const club = await BookClub.findById(clubId);
    await BookClub.findByIdAndUpdate(clubId, { $pull: { invites: userId } });
    club.members.push(userId);
    await club.save();
    await User.findByIdAndUpdate(userId, { $pull: { invites: clubId } });
    req.flash('success', `You accepted the invitation to join ${club.name}`);
    res.redirect(`/bookclubs/${clubId}`)
};

module.exports.rejectClubInvite = async (req, res, next) => {
    const userId = req.user._id;
    const clubId = req.body.club;
    const club = await BookClub.findById(clubId);
    await BookClub.findByIdAndUpdate(clubId, { $pull: { invites: userId } });
    await club.save();
    await User.findByIdAndUpdate(userId, { $pull: { invites: clubId } });
    req.flash('error', `You declined the invitation to join ${club.name}`);
    res.redirect('/home')
};