const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../../utils/catchAsync');
const books = require('../../controllers/clubs/books');


router.post('/', catchAsync(books.createBook));

router.route('/:bookId')
    .get(catchAsync(books.showBook))
    .delete(catchAsync(books.deleteBook));

module.exports = router;