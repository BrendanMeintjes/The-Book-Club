const mongoose = require('mongoose');
const Reply = require('./reply');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    body: String,
    rating: Number,
    bookclub: {
        type: Schema.Types.ObjectId,
        ref: 'BookClub'
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reply'
        }
    ]

},
    {
        timestamps: true
    });

CommentSchema.post('findOneAndDelete', async function (doc, next) {
    if (doc) {
        await Reply.deleteMany({ comment: doc._id });
        next()
    }
});

module.exports = mongoose.model('Comment', CommentSchema);

//try clean up unneccesary references across all models