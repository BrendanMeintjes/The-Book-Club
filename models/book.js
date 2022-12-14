const mongoose = require('mongoose');
const Comment = require('./comment');
const Reply = require('./reply');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: String,
    image: String,
    author: String,
    category: String,
    publisher: String,
    list: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    bookclub: {
        type: Schema.Types.ObjectId,
        ref: 'BookClub'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, {
    timestamps: true
});

// BookSchema.post('findOneAndDelete', async function (book) {
//     if(book.comments.length){
//         const res = await Comment.deleteMany({_id: { $in: book.comments } })
//         console.log(res);
//     }
// });

BookSchema.post('findOneAndDelete', async function (doc, next) {
    if (doc) {
        await Comment.deleteMany({ book: doc._id });
        await Reply.deleteMany({ book: doc._id });
        next()
    }
});


module.exports = mongoose.model('Book', BookSchema);