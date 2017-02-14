var _ = require("underscore");
var express = require('express');
var router = express.Router();
var middles = require('../config/middlewares');
var User = require('../models/user');



router.get('/api/account', middles.authorize, function (req, res) {

    res.json(_.omit(req.user, "password"));

});

router.post('/api/account/reset_pw', middles.authorize, function (req, res) {

    if (req.body.newPass == undefined)
        return res.status(500).send('specify newPass');

    if (req.user.role == 'admin' && req.body.userId != undefined) 
        User.resetUserPassword(req.body.userId, req.body.newPass, function () {
            res.status(200).send('password changed');
        });
    else 
        User.resetUserPassword(req.user._id, req.body.newPass, function () {
            res.status(200).send('password changed');
        });

});



module.exports = router;
