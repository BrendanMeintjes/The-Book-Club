const mongoose = require('mongoose');
const Comment = require('./comment');
const Reply = require('./reply');
const Book = require('./book');
const Schema = mongoose.Schema;

const BookClubSchema = new Schema({
    name: String,
    description: String,
    picture: {
        url: String,
        filename:String
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    books: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Book',
        }
    ],
    invites: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    requests: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]

});

BookClubSchema.post('findOneAndDelete', async function (doc, next) {
    if (doc) {
        await Book.deleteMany({ _id: { $in: doc.books } });
        await Comment.deleteMany({ bookclub: doc._id });
        await Reply.deleteMany({ bookclub: doc._id });
        next()
    }
});


module.exports = mongoose.model('BookClub', BookClubSchema);