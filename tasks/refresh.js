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
var BASE_URL = "http://azdrama.sx"
,	HK_DRAMA = "/hk-drama"
,	HK_SHOW = "/hk-show"
,	DEFAULT_SELECTOR = "#m .content a";

// create crawler job
async.series([

	// remove old jobs
	function(done) { Job.collection.drop(done); },
	function(done) { Job.ensureIndexes(done); },

	// now add the entry job!
	function(done) {
		var url = BASE_URL + HK_DRAMA
		,	url2 = BASE_URL + HK_SHOW
		,	selector = DEFAULT_SELECTOR;

		Job.create(url, selector, done);
		Job.create(url2, selector, done);
	}

], function(err) {

	if(err) console.log('refresh task error - ' + err);
	else console.log('refresh started');

	// exit process either way
	process.exit();

});