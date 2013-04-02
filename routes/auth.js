/////////////////
// Auth Routes //
/////////////////

// dependencies
var _ = require('underscore')
,	url = require('url')
,	request = require('request')
,	async = require('async')
,	models = require('../models')


exports.index = function(req, res) {
	res.render('login');
};

exports.login = function(req, res) {
	var body = req.body
	,	username = body.username
	,	password = body.password;
	if(username === "admin" && password === "onepiece") {
		req.session.loggedIn = true;
		res.redirect('/admin');
	} else {
		res.send(401);
	}
}

// checks if a user is logged in
exports.check = function(req, res, next) {
	var session = req.session;
	if(session && session.loggedIn) {
		next();
	} else {
		res.send(401);
	}
};