var express = require('express');
var router = express.Router();
var passport = require('passport');


var User = require('../models/user');

// Register
router.get('/users/register', function (req, res) {
    res.render('auth', { title: 'Register', auth_type: 'register' });
});

// Login
router.get('/users/login', function (req, res) {
    if (req.user != undefined)
        return res.redirect('/');
    res.render('auth', { title: 'Login', auth_type: 'login' });

});


// Register User
router.post('/users/register', function (req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {

        res.render('auth', {
            auth_type: 'register',
            errors: errors
        });



    } else {

        User.getUserByEmail(email, function (err, qResult) {
            console.log("getUserByEmail", email, qResult);
            if (qResult == null) {

                var newUser = new User({
                    name: name,
                    email: email,
                    username: email,
                    password: password,
                    role : ''
                });

                User.createUser(newUser, function (err2, user) {
                    if (err2) throw err2;
                    req.flash('success_msg', 'You are registered and can now login');

                    res.render('auth', { auth_type: 'login' });
                });



            } else {

                req.flash('error', 'Input email is used by another account .');

                res.redirect("/users/register");

            }

        });


    }
});



router.post('/users/login',
    passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), function (req, res) {

        var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
        delete req.session.redirectTo;
        // is authenticated ?

     
        
        res.redirect(redirectTo);

    });

router.get('/users/logout', function (req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});

module.exports = router;