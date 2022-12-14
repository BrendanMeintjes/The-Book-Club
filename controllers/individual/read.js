const Book = require('../../models/book');


module.exports.findBooks = async (req, res) => {
    const books = await Book.find({
        user: req.user._id,
        list: "read"
    });
    res.render('books/index', { books })
};

module.exports.showBooks = async (req, res) => {
    const book = await Book.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate({
        path: 'comments',
        populate: {
            path: 'replies',
            populate: {
                path: 'author'
            }
        }
    });
    const currentDate = new Date();

    res.render('books/show', { book, currentDate });
};

module.exports.createBook = async (req, res) => {
    const bookId = req.body.bookId;
    const book = new Book(req.body.book);
    book.user = req.user._id;
    book.list = "read";
    await book.save();
    req.flash('success', `Succesfuly added ${book.title} to read list`);
    res.redirect(`/books/results/#${bookId}`);
};

module.exports.changeToWishlist = async (req, res) => {
    const bookId = req.body.bookId;
    const bookTitle = req.body.book.title
    const bookAuthor = req.body.book.author
    const book = await Book.findOne({ title: bookTitle, author: bookAuthor });
    book.list = "wishlist";
    await book.save();
    res.redirect(`/books/results/#${bookId}`);
}


module.exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.redirect('/home');
}
