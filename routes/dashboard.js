var express = require('express');
var router = express.Router();
var _ = require("underscore");
var middles = require('../config/middlewares');

var moment = require('moment');
moment.locale('fa');


router.get('/', middles.authorize, function (req, res) {
    res.redirect('/timesheets');
  //  res.render('index', { moment: moment, title: 'Dashboard' });

});


router.get('/timesheets', middles.authorize, function (req, res) {

    res.render('timesheets', { moment: moment, title: 'Time sheets' });

});

router.get('/projects', middles.authorize, function (req, res) {

    res.render('projects', { moment: moment, title: 'Projects' });

});

router.get('/wages', middles.authorize, function (req, res) {

    res.render('wages', { moment: moment, title: 'Wages' });

});


router.get('/fund', middles.authorize, function (req, res) {

    res.render('fund', { moment: moment, title: 'Fund' });

});

router.get('/users', middles.authorize, function (req, res) {

    res.render('users', { moment: moment, title: 'Users' });

});




router.get('/locations', middles.authorize, function (req, res) {

    res.render('locations', { moment: moment, title: 'Locations' });

});






/// Account Area

router.get('/account/settings', middles.authorize, function (req, res) {

    res.render('account/settings', { moment: moment, title: 'My account' });

});



/// Account Area



module.exports = router;