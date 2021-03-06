//////////////////
// Admin Routes //
//////////////////

// dependencies
var _ = require('underscore')
,	url = require('url')
,	request = require('request')
,	async = require('async')
,	models = require('../models')
,	Job = models.Job
,	Video = models.Video;


// constants
var BASE_URL = "http://azdrama.sx"
,	HK_DRAMA = "/hk-drama"
,	DEFAULT_SELECTOR = "#m .content a";


exports.index = function(req, res) {
	res.render('admin');
};

exports.refresh = function(req, res) {
	async.series([

		// remove old jobs
		function(done) { Job.collection.drop(done); },
		function(done) { Job.ensureIndexes(done); },

		// now add the entry job!
		function(done) {
			var url = BASE_URL + HK_DRAMA
			,	selector = DEFAULT_SELECTOR;
			Job.create(url, selector, done);
		}

	], function(err) {

		if(err) res.send(err);
		else res.send('refreshing...');

	});
}

exports.rebuild = function(req, res) {
	async.series([

		// drop the collections
		function(done) { Job.collection.drop(done); },
		function(done) { Video.collection.drop(done); },

		// rebuild indexes
		function(done) { Job.ensureIndexes(done); },
		function(done) { Video.ensureIndexes(done); },

		// now add the entry job!
		function(done) {
			var url = BASE_URL + HK_DRAMA
			,	selector = DEFAULT_SELECTOR;
			Job.create(url, selector, done);
		}

	], function(err) {

		if(err) res.send(err);
		else res.send('rebuilding...');

	});
}

exports.stop = function(req, res) {
	Job.collection.remove(function(err) {
		if(err) res.send(err);
		else res.send('stopping jobs...');
	});
};

exports.test = function(req, res) {
	res.send('started test action');
}