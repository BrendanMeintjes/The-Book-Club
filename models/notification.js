const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    body: String,
    bookId: String,
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    reply: {
        type: Schema.Types.ObjectId,
        ref: 'Reply'
    },
    club: {
        type: Schema.Types.ObjectId,
        ref: 'bookclub'
    },
    reciever: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Notification', NotificationSchema);
