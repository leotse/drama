//////////////////
// Refresh Task //
//////////////////
// task to initiate job to crawl azdrama
// job then gets picked up by the spider worker

// dependencies
var async = require('async')
,	models = require('../models')
,	Job = models.Job;

// constants
var BASE_URL = "http://azdrama.net"
,	HK_DRAMA = "/hk-drama"
,	DEFAULT_SELECTOR = "#m .content a";

// create crawler job
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

	if(err) console.log('refresh task error - ' + err);
	else console.log('refresh started');

	// exit process either way
	process.exit();

});