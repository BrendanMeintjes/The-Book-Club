if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize')

const userRoutes = require('./routes/users')
const bookclubRoutes = require('./routes/clubs/bookclubs');
const bookRoutes = require('./routes/clubs/books');
const clubCommentRoutes = require('./routes/comments');
const replyRoutes = require('./routes/clubs/replies');
const readRoutes = require('./routes/individual/read');
const individualReadCommentRoutes = require('./routes/individual/readComments');
const individualReadReplyRoutes = require('./routes/individual/readReplies');
const wishlistRoutes = require('./routes/individual/wishlist');
const wishlistCommentRoutes = require('./routes/individual/wishlistComments');
const wishlistReplyRoutes = require('./routes/individual/wishlistReplies');
const booksRoutes = require('./routes/individual/books');
const friendRoutes = require('./routes/individual/friend');
const friendsRoutes = require('./routes/individual/friends');
const notificationRoutes = require('./routes/notifications');
const invitationRoutes = require('./routes/invitations');
const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/the-book-club';




mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(mongoSanitize())

const secret = process.env.SECRET || 'thisisnotagoodsecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function (e) {
    console.log("sessionstore error", e)
})

const sessionConfig = {
    store,
    name: 'ses_id',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 24,
        maxAge: 1000 * 60 * 24
    }
}
app.use(session(sessionConfig));
app.use(flash());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://www.googleapis.com/",
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [
    "https://cdn.jsdelivr.net",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "http://books.google.com/books/content",
                `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.use('/', userRoutes);
app.use('/bookclubs', bookclubRoutes);
app.use('/bookclubs/:id/books', bookRoutes);
app.use('/bookclubs/:id/books/:bookId/comments', clubCommentRoutes);
app.use('/bookclubs/:id/books/:bookId/comments/:commentId/', replyRoutes);
app.use('/books/read', readRoutes);
app.use('/books/read/:bookId/comments', individualReadCommentRoutes);
app.use('/books/read/:bookId/comments/:commentId', individualReadReplyRoutes);
app.use('/books/wishlist', wishlistRoutes);
app.use('/books/wishlist/:bookId/comments', wishlistCommentRoutes);
app.use('/books/wishlist/:bookId/comments/:commentId', wishlistReplyRoutes);
app.use('/books/', booksRoutes);
app.use('/friend', friendRoutes);
app.use('/friends', friendsRoutes);
app.use('/notifications', notificationRoutes);
app.use('/', invitationRoutes);

app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oof ma goof, something whent wrong'
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('serving on port 3000')
});