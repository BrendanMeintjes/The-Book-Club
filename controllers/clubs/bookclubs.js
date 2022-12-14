const BookClub = require('../../models/bookClub');
const Search = require('../../models/search');
const User = require('../../models/user');
const axios = require('axios');

module.exports.index = async (req, res) => {
    const userId = req.user._id
    const clubs = await BookClub.find({
        $or: [
            { admin: userId },
            { members: userId }
        ]
    }).populate('admin');
    res.render('bookclubs/index', { clubs });
};


module.exports.renderNewForm = (req, res) => {
    res.render('bookclubs/new');
};

module.exports.createBookclub = async (req, res, next) => {
    const club = new BookClub(req.body.club);
    club.admin = req.user._id;
    club.picture = ({ url: req.file.path, filename: req.file.filename });
    console.log(club)
    await club.save();
    req.flash('success', 'New bookclub created');
    res.redirect(`/bookclubs/${club._id}`);
};

module.exports.searchUser = async (req, res, next) => {
    const name = req.body.usersearch;
    const club = await BookClub.findById(req.params.id);
    const searches = await User.find({ username: { '$regex': name, $options: 'i' } });
    res.render('bookclubs/inviteUser', { searches, club });
    console.log(name);
    console.log(searches);
    console.log(club);
};


module.exports.inviteUser = async (req, res, next) => {
    const { id } = req.params;
    const club = await BookClub.findById(id);
    const userId = req.body.user;
    const inviteUser = await User.findById(userId);
    club.invites.push(inviteUser);
    inviteUser.invites.push(club);
    await club.save();
    await inviteUser.save();
    req.flash('success', 'Invite Sent!');
    res.redirect(`/bookclubs/${club._id}`);
    console.log(inviteUser);
};

module.exports.removeUser = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.body.userId;
    const club = await BookClub.findByIdAndUpdate(id, { $pull: { members: userId } });
    res.redirect('back');
    //add to routes//
};


module.exports.searchBooks = async (req, res) => {
    Search.deleteMany({}, function (err) {
    });

    const { id } = req.params
    const club = await BookClub.findById(id)
    const selectId = req.body.select;
    const searchId = req.body.search;
    var results = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=in${selectId}:${searchId}&${process.env.GOOGLEBOOKSAPI_KEY}&maxResults=40`);

    for (let i = 0; i < results.data.items.length; i++) {
        if (results.data.items[i].volumeInfo.imageLinks) {
            // console.log(results.data.items[i].volumeInfo.title);
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

    const searches = await Search.find({});
    const clubs = await BookClub.find({})
    res.render('bookclubs/books/results', { searches, clubs, id });
};

module.exports.showBookclub = async (req, res) => {
    const { id } = req.params;
    const user = req.user._id;
    const club = await BookClub.findById(req.params.id).populate({
        path: 'books',
        populate: {
            path: 'comments',
            populate: {
                path: 'author',
            }
        }
    }).populate({
        path: 'books', options: { sort: { 'createdAt': -1 } },
        populate: {
            path: 'comments',
            populate: {
                path: 'replies',
                populate: {
                    path: 'author'
                }
            }
        }
    }).populate('admin').populate('members');
    if (!club) {
        req.flash('error', 'Cannot find bookclub')
        return res.redirect('/bookclubs');
    }
    const currentDate = new Date();

    res.render('bookclubs/show', { club, id, user, currentDate });
    console.log(currentDate)
};



module.exports.leaveClub = async (req, res, next) => {
    const clubId = req.params.id;
    const userId = req.user._id;
    const club = await BookClub.findById(clubId);
    await BookClub.findByIdAndUpdate(clubId, { $pull: { members: userId } });
    req.flash('success', `Successfully left ${club.name}`)
    res.redirect('/home');
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const club = await BookClub.findById(id)
    if (!club) {
        req.flash('error', 'Cannot find bookclub')
        return res.redirect('/bookclubs');
    }
    res.render('bookclubs/edit', { club });
};

module.exports.editBookclub = async (req, res) => {
    const { id } = req.params;
    const club = await BookClub.findByIdAndUpdate(id, { ...req.body.club });
    const updated = await BookClub.findById(id)
    req.flash('success', `Succesfuly updated ${updated.name}`);
    res.redirect(`/bookclubs/${club._id}`);
}

module.exports.deleteBookclub = async (req, res) => {
    const { id } = req.params;
    const club = await BookClub.findByIdAndDelete(id);
    req.flash('success', `${club.name} successfully deleted`);
    res.redirect('/home');
};