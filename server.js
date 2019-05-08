const express = require('express');
const bp = require('body-parser');
const path = require('path');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var session = require('express-session');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var passport = require('passport');

const app = express();

const SERVER_PORT = process.env.PORT || 5000;

//body parser
app.use(bp.json());
app.use(bp.urlencoded({extended: false}));

//View engine
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({default:'index'}));
app.set('views', path.join(__dirname, 'views'));

// BodyParser Middleware
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
}));
  
// Express Session
app.use(session({
    key: 'user_sid',
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    cookie: {
        expires: 6000000
    }
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

// Global Variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.book_error = req.flash('book_error');
    res.locals.error_message = req.flash('error_message');
    res.locals.user = req.user || null;
    next();
}); 

app.use('/', require('./routes/index'));
app.use('/', require('./routes/login'));
app.use('/', require('./routes/signup'));
app.use('/', require('./routes/booking'));
app.use('/', require('./routes/final_booked'));
app.use('/', require('./routes/mybookings'));
app.use('/', require('./routes/forgotpassword'));
app.use('/', require('./routes/reset'));
app.use('/', require('./routes/car_selection'));


app.listen(SERVER_PORT,function(){
    console.log('http://localhost:5000');
})