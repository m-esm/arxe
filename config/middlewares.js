var express = require('express');
var _ = require("underscore");

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
     
 
            return next();

    } else {

        req.session.redirectTo = req.url;
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');

    }
};


module.exports = { authorize: ensureAuthenticated };
