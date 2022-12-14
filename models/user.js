const mongoose = require('mongoose');
const BookClub = require('./bookClub');
const Comment = require('./comment');
const Reply = require('./reply');
// const Wishlist = require('./wishlist');

const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: {
        url: String,
        filename: String
    },
    invites: [
        {
            type: Schema.Types.ObjectId,
            ref: 'BookClub'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    friendRequestsRecieved: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    friendRequestsSent: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    notifications: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Notification'
        }
    ]

});
UserSchema.plugin(passportLocalMongoose);

UserSchema.post('findOneAndDelete', async function (doc, next) {
    if (doc) {
        await BookClub.deleteMany({ admin: doc._id });
        await Comment.deleteMany({ author: doc._id });
        await Reply.deleteMany({ author: doc._id });
        await Read.deleteMany({ admin: doc._id });
        await Wishlist.deleteMany({ admin: doc._id });
        next()
    }
});

module.exports = mongoose.model('User', UserSchema);