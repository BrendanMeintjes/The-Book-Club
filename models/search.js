const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SearchSchema = new Schema({
    title: String,
    image: String,
    author: Array,
    category: String,
    publisher: String,
    snippet: String
});

module.exports = mongoose.model('Search', SearchSchema);