var _ = require("underscore");
var express = require('express');
var router = express.Router();
var middles = require('../config/middlewares');
var User = require('../models/user');



router.get('/api/account',middles.authorize,function(req,res){

	res.json(_.omit(req.user,"password"));

});

module.exports = router;
