////////////
// Spider //
////////////
// spider that crawls azdrama.net for all the content i am interested in, haha


// dependencies
var $ = require('jquery')
,	_ = require('underscore')
,	util = require('util')
,	request = require('request')
,	async = require('async')
,	models = require('../models')
,	Job = models.Job
,	Page = models.Page
,	Video = models.Video;


// constants
var BASE_URL = "http://azdrama.net"
,	HK_DRAMA = "/hk-drama"
,	DEFAULT_SELECTOR = "#m .content a";


// test data!
async.series([

	// first drop the collection
	// function(done) { Job.collection.drop(done); },

	// now add the entry job!
	function(done) {
		createJob(BASE_URL + HK_DRAMA, '#m .content .normal > a', done);
	}

], start);

// start workers
function start() {
	_.times(10, getJob);
}

function getJob() {
	Job.findOneAndUpdate(
		{ state: "pending" },
		{ state: "processing" },
		{ new: false, upsert: false },
		processJob
	);
}

function processJob(err, job) {
	if(err) waitThenGetJob();
	else if(!job) waitThenGetJob();
	else {
		
		var url = job.url
		,	selector = job.selector;

		console.log('processing - ' + url);

		if(url.toLowerCase().indexOf('.html') >= 0) {

			// video page! save the video
			processVideo(job);

		} else {

			// not a video page! add all the links
			processLinks(job);
		}
	}
}

function processVideo(job) {
	var url = job.url
	,	selector = job.selector;

	var series, episode;
	async.waterfall([

		// download the video host page
		function(done) { downloadPage(url, done); },

		// get the video page
		function(body, done) {
			var $html = $(body);

			// get video link
			var $video = $html.find('#player iframe')
			,	url = $video.attr('src');

			// get episode metadata
			var title = $html.find('title').text()
			,	match = (/(.+)\s-\sepisode\s(\d+)/i).exec(title);

			if(match) {
				series = match[1]
				episode = match[2];
			}

			// force html5 video
			url += "&html5=1";
			downloadPage(url, done);
		},

		// get the video url
		function(body, done) {
			var url = $(body).find('video source').attr('src');

			// save video to db!
			var vid = new Video;
			vid.series = series;
			vid.episode = episode;
			vid.url = url;
			vid.save(done);
		}

	], getJob);
}

function processLinks(job) {
	var url = job.url
	,	selector = job.selector;

	async.waterfall([

		// download page
		function(done) { downloadPage(url, done); },

		// get the links of interest
		function(body, done) {
			var $html = $(body)
			,	links = $html.find(selector);

			// create a list of links
			var hrefs = _.map(links, function(link) { 
				return link.href; 
			});
			var filtered = _.filter(hrefs, function(href) { 
				return href.toLowerCase().indexOf(BASE_URL) >= 0; 
			});

			done(null, filtered);
		},

		// create jobs for the links
		function(urls, completed)  {
			async.each(urls, function(furl, done) {
				createJob(furl, DEFAULT_SELECTOR, done);
			}, completed);
		},

		// update job state to complete
		function(done) {
			job.state = 'complete';
			job.save(done);
		}

	], getJob);
}

function waitThenGetJob(err) {
	console.log('worker waiting for job');
	setTimeout(getJob, 1000);
}

function downloadPage(url, done) {
	request(url, function(err, res, body) {
		if(err) done(new Error('download page error - ' + err));
		else if(res.statusCode !== 200) done(new Error('download page error - ' + res.statusCode));
		else done(null, body);
	});
}

function createJob(url, selector, done) {
		var job = new Job;
		job.url = url
		job.selector = selector;
		job.save(done);
}