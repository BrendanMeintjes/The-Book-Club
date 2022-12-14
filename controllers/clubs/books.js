const Book = require('../../models/book');
const BookClub = require('../../models/bookClub');

module.exports.showBook = async (req, res) => {
    const book = await Book.findById(req.params.bookId).populate({
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

    const club = await BookClub.findById(req.params.id);
    const comment = await BookClub.findById(req.params.commentId);
    res.render('bookclubs/books/show', { book, club, comment, currentDate });
};

module.exports.createBook = async (req, res) => {
    const { id } = req.params;
    const club = await BookClub.findById(id);
    const book = new Book(req.body.book);
    club.books.push(book);
    book.bookclub = club;
    await club.save();
    await book.save();
    req.flash('success', `${book.title} successfully added to ${club.name}`);
    res.redirect(`/bookclubs/${club._id}`);
};

module.exports.deleteBook = async (req, res) => {
    const { id, bookId } = req.params;
    await BookClub.findByIdAndUpdate(id, { $pull: { books: bookId } });
    const book = await Book.findByIdAndDelete(bookId);
    req.flash('success', `${book.title} successfuly deleted`);
    res.redirect(`/bookclubs/${id}`);
}