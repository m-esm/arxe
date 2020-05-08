var _ = require('underscore');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var viewEng = require('ejs-mate');
var mongoCnStr = process.env['MONGODB'] || 'mongodb://localhost:27017/arxe';
var MongoStore = require('connect-mongo')(session);
var mongoStore = new MongoStore({ url: mongoCnStr })



mongoose.Promise = global.Promise;


mongoose.connect(mongoCnStr);
var db = mongoose.connection;




var passportConfigs = require('./config/passport');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', viewEng);

app.set('view engine', 'ejs');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({

    secret: 'secret',
    key: 'express.sid',
    store: mongoStore,
    resave: true,
    saveUninitialized: true

}));


// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {


    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    if (req.user)
        req.user._id = '"' + req.user._id + '"';

    res.locals.user = req.user || null;
    res.locals.title = '';
    next();
});


app.use('/', require('./routes/dashboard'));
app.use('/', require('./routes/users'));
app.use('/', require('./rest-apis/arxe'));
app.use('/', require('./rest-apis/account'));


app.get('/json', function (req, res) {

    res.set('Content-Type', 'text/html');

    res.write('<form enctype="application/json" method="post"><textarea style="width:100%;height:500px;" name="data"></textarea><input type="submit" /></form>');

    res.end();

});


app.post('/json', function (req, res) {

    var fs = require('fs');

    var posts = JSON.parse(req.body.data).posts.data;
    var textToWrite = "";
    posts.forEach(function (item, index) {
        textToWrite += item.full_picture + "\n";
    });

    fs.writeFile(req.query.file + '.txt', textToWrite, function(err) {
        if (err) throw err;
        res.write('saved to ' + req.query.file + '.txt');
        res.end();
    });

    

});

// Set Port
app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'));
});