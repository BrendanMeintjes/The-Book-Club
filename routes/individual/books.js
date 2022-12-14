const express = require('express');
const router = express.Router({ mergeParams: true});
const catchAsync = require('../../utils/catchAsync');
const books = require('../../controllers/individual/books');

router.route('/search')
    .get(books.renderSearchForm)
    .post(catchAsync(books.searchIndividualBooks));

router.get('/results', catchAsync(books.getIndividualResults));


module.exports = router;