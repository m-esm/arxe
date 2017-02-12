var express = require('express');
var _ = require("underscore");

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
     
        if (req.user.role == undefined || req.user.role == '')
        {
            req.flash('error_msg','Please wait for confirmation or contact admin . ');
            res.redirect('/users/login');
        }
        else
            return next();

    } else {

        req.session.redirectTo = req.url;
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');

    }
};


module.exports = { authorize: ensureAuthenticated };
