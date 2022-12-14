const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    body: String,
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
},
    {
        timestamps: true
    });


module.exports = mongoose.model('Reply', ReplySchema);

//try clean up unneccesary references across all models