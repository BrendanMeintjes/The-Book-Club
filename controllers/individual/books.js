const express = require('express');
const axios = require('axios');
const Search = require('../../models/search');
const Book = require('../../models/book');


module.exports.renderSearchForm = (req, res) => {
    res.render('books/search');
};

module.exports.getIndividualResults = async (req, res) => {
    const searches = await Search.find({});
    const read = await Book.find({
        user: req.user._id,
        list: "read"
    });
    const wishlist = await Book.find({
        user: req.user._id,
        list: "wishlist"
    });
    res.render('books/results', { searches, read, wishlist });
};

module.exports.searchIndividualBooks = async (req, res) => {
    Search.deleteMany({}, function (err) {
        console.log("success");
    });
    const selectId = req.body.select;
    const searchId = req.body.search;
    console.log(searchId, selectId);
    var results = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=in${selectId}:${searchId}&${process.env.GOOGLEBOOKSAPI_KEY}&maxResults=40`);

    for (let i = 0; i < results.data.items.length; i++) {
        if (results.data.items[i].volumeInfo.imageLinks) {
            const title = results.data.items[i].volumeInfo.title;
            const image = results.data.items[i].volumeInfo.imageLinks.thumbnail;
            const author = results.data.items[i].volumeInfo.authors;
            const category = results.data.items[i].volumeInfo.title;
            const publisher = results.data.items[i].volumeInfo.publisher;
            try {
                var snippet = results.data.items[i].volumeInfo.description;
            }
            catch (err) {
                var snippet = "No information available"
            }

            const search = new Search;
            search.title = title;
            search.image = image;
            search.author = author;
            search.category = category;
            search.publisher = publisher;
            search.snippet = snippet;

            await search.save();


        }
    }

    res.redirect('/books/results');
}