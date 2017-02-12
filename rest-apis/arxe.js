var _ = require("underscore");
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var middles = require('../config/middlewares');
var User = require('../models/user');
var Project = require('../models/project');
var Location = require('../models/location');
var Wage = require('../models/wage');
var Timesheet = require('../models/timesheet');
var Fund = require('../models/fund');

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var time_diffrence = function (start, end) {

    var time1 = start.split(':'), time2 = end.split(':');
    var hours1 = parseInt(time1[0], 10),
        hours2 = parseInt(time2[0], 10),
        mins1 = parseInt(time1[1], 10),
        mins2 = parseInt(time2[1], 10);
    var hours = hours2 - hours1, mins = 0;

    // get hours
    if (hours < 0) hours = 24 + hours;

    // get minutes
    if (mins2 >= mins1) {
        mins = mins2 - mins1;
    }
    else {
        mins = (mins2 + 60) - mins1;
        hours--;
    }

    // convert to fraction of 60

    //  hours += mins;
    return {
        hours: hours,
        mins: mins,
        totalHour: hours + mins / 60
    };

};



router.get('/api/users', middles.authorize, function (req, res) {

    var query = {};
    if (req.user.role == 'user')
        query = {
            _id: req.user._id
        };

    User.find(query, '-password -__v', function (err, data) {

        res.json(data);

    });

});
router.post('/api/users/remove', middles.authorize, function (req, res) {

    if (req.user.role != 'admin')
        res.status('403', 'no access honey ;)');

    User.findOneAndRemove(req.body._id, function (err, model) {

        if (err)
            throw err;

        res.json(model);

    });


});
router.post('/api/users/upsert', middles.authorize, function (req, res) {

    if (req.user.role != 'admin')
        res.status('403', 'no access honey ;)');


    if (!req.body._id)
        req.body._id = new mongoose.mongo.ObjectID();

    User.findOneAndUpdate({ _id: req.body._id }, { $set: _.omit(req.body, ["_id", '__v']) }, { upsert: true, 'new': true }, function (err, model) {

        if (err)
            throw err;

        res.json(model);

    });

});




router.get('/api/projects', middles.authorize, function (req, res) {

    Project.find({}, function (err, data) {

        res.json(data);

    });


});
router.post('/api/projects/remove', middles.authorize, function (req, res) {

    if (req.user.role != 'admin')
        res.status('403', 'no access honey ;)');

    Project.findOneAndRemove(req.body._id, function (err, model) {

        if (err)
            throw err;

        res.json(model);

    });


});
router.post('/api/projects/upsert', middles.authorize, function (req, res) {

    if (req.user.role != 'admin')
        res.status('403', 'no access honey ;)');

    if (!req.body._id)
        req.body._id = new mongoose.mongo.ObjectID();

    Project.findOneAndUpdate({ _id: req.body._id }, { $set: _.omit(req.body, ["_id", '__v']) }, { upsert: true, 'new': true }, function (err, model) {

        if (err)
            throw err;


        res.json(model);

    });

});

router.get('/api/funds', middles.authorize, function (req, res) {

    if (req.user.role != 'admin')
        res.status('403', 'no access honey ;)');

    Fund.find({}, function (err, data) {

        res.json(data);

    });


});
router.post('/api/funds/remove', middles.authorize, function (req, res) {

    if (req.user.role != 'admin')
        res.status('403', 'no access honey ;)');

    Fund.findOneAndRemove(req.body._id, function (err, model) {

        if (err)
            throw err;

        res.json(model);

    });


});
router.post('/api/funds/upsert', middles.authorize, function (req, res) {

    if (req.user.role != 'admin')
        res.status('403', 'no access honey ;)');

    if (!req.body._id)
        req.body._id = new mongoose.mongo.ObjectID();

    Fund.findOneAndUpdate({ _id: req.body._id }, { $set: _.omit(req.body, ["_id", '__v']) }, { upsert: true, 'new': true }, function (err, model) {

        if (err)
            throw err;


        res.json(model);

    });

});




router.get('/api/locations', middles.authorize, function (req, res) {

    Location.find({}, function (err, data) {

        res.json(data);

    });


});
router.post('/api/locations/remove', middles.authorize, function (req, res) {

    Location.findOneAndRemove(req.body._id, function (err, model) {

        if (err)
            throw err;

        res.json(model);

    });


});
router.post('/api/locations/upsert', middles.authorize, function (req, res) {

    if (!req.body._id)
        req.body._id = new mongoose.mongo.ObjectID();

    Location.findOneAndUpdate({ _id: req.body._id }, { $set: _.omit(req.body, ["_id", '__v']) }, { upsert: true, 'new': true }, function (err, model) {

        if (err)
            throw err;


        res.json(model);

    });

});




router.get('/api/wages', middles.authorize, function (req, res) {

    if (req.user.role != 'admin')
        res.status('403', 'no access honey ;)');

    Wage.find({}, function (err, data) {

        res.json(data);

    });


});
router.post('/api/wages/remove', middles.authorize, function (req, res) {
    if (req.user.role != 'admin')
        res.status('403', 'no access honey ;)');
    Wage.findOneAndRemove(req.body._id, function (err, model) {

        if (err)
            throw err;

        res.json(model);

    });


});
router.post('/api/wages/upsert', middles.authorize, function (req, res) {
    if (req.user.role != 'admin')
        res.status('403', 'no access honey ;)');
    if (!req.body._id)
        req.body._id = new mongoose.mongo.ObjectID();

    Wage.findOneAndUpdate({ _id: req.body._id }, { $set: _.omit(req.body, ["_id", '__v']) }, { upsert: true, 'new': true }, function (err, model) {

        if (err)
            throw err;


        res.json(model);

    });

});



router.get('/api/timesheets', middles.authorize, function (req, res) {

    var query = {};
    if (req.user.role == 'user')
        query = {
            personId: req.user._id
        };

    Timesheet.find(query, function (err, data) {

        res.json(data);

    });


});
router.post('/api/timesheets/remove', middles.authorize, function (req, res) {

    Timesheet.findOneAndRemove(req.body._id, function (err, model) {

        if (err)
            throw err;

        res.json(model);

    });


});

router.post('/api/timesheets/upsert', middles.authorize, function (req, res) {

    if (!req.body._id)
        req.body._id = new mongoose.mongo.ObjectID();

    Timesheet.findOneAndUpdate({ _id: req.body._id }, { $set: _.omit(req.body, ["_id", '__v']) }, { upsert: true, 'new': true }, function (err, model) {

        if (err)
            throw err;


        res.json(model);

    });

});




router.post('/api/analytics/salary', middles.authorize, function (req, res) {

    var itemsIds = req.body;
    var _wages = [];
    var _funds = [];
    var _locations = [];
    var analytics = {
        totalSalary: 0,
        totalPaidSalary: 0,
        totalUnpaidSalary: 0,
    };

    function _getFunds(callBack) {
        Fund.find({}, function (fundErr, funds) {
            _funds = funds;
            callBack();
        });
    }

    function _getWages(callBack) {
        Wage.find({}, function (wageErr, wages) {
            _wages = wages;
            callBack();
        });
    }

    function _getLocations(callBack) {
        Location.find({}, function (locErr, locs) {
            _locations = locs;
            callBack();
        });
    }

    function mainQuery(callback) {

        Timesheet.find(
            {
                _id: {
                    $in: itemsIds
                }
            },

            function (err, timeSheets) {

                var timeSheetsPerUser = _.groupBy(timeSheets, 'personId');


                _.keys(timeSheetsPerUser).forEach(function (personId, tsUserIndex) {

                    var _userSalary = 0;
                    var _userPaid = _.reduce(
                        _.where(
                            _funds, {
                                personId: personId
                            }), function (memo, fund) {
                                return memo + fund.price;
                            }, 0);

                    analytics.totalPaidSalary += _userPaid;


                    var _userUnpaid = 0;

                    timeSheetsPerUser[personId].forEach(function (ts, tsIndex) {

                        ts = ts.toObject();

                        if (ts.dateJalali == undefined)
                            return;

                        var tsJalaliNumber = parseInt(ts.dateJalali.replaceAll('/', ''));

                        var userWage = _.min(_.where(_wages, {
                            personId: ts.personId
                        }), function (_w) {

                            _w = _w.toObject();
                            if (_w.startJalali == undefined)
                                return false;

                            _w.startJalaliNumber = parseInt(_w.startJalali.toString().replaceAll('/', ''));



                            if (tsJalaliNumber - _w.startJalaliNumber >= 0)
                                return tsJalaliNumber - _w.startJalaliNumber;

                        });

                        var location = _.find(_locations, {
                            _id: ts.locationId
                        });

                        _userSalary = (userWage.perHour + location.plusCost) * time_diffrence(ts.start, ts.end).totalHour;



                        analytics.totalSalary += _userSalary;

                    });



                });

                analytics.totalUnpaidSalary = analytics.totalSalary - analytics.totalPaidSalary;

                res.json(analytics);




            });


    }

    _getFunds(function () {
        _getWages(function () {

            _getLocations(function () {

                mainQuery();

            });

        });
    });










});






module.exports = router;
