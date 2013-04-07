////////////
// Spider //
////////////
// spider that crawls azdrama.net for all the content i am interested in, haha

// prod mode?
// process.env.PORT = 3000;

// dependencies
var $ = require('cheerio')
,	_ = require('underscore')
,	util = require('util')
,	request = require('request')
,	async = require('async')
,	models = require('../models')
,	Job = models.Job
,	Page = models.Page
,	Video = models.Video
,	memwatch = require('memwatch')
,	fs = require('fs');


// memory monitor
var hd = new memwatch.HeapDiff();
memwatch.on('leak', function(info) {
	var diff = hd.end();
	fs.writeFile('diff.txt', JSON.stringify(diff), function(err) {
		if(err) throw err;
		else  console.log('leak detected!');
	})
});

// constants
var BASE_URL = "http://azdrama.net"
,	HK_DRAMA = "/hk-drama"
,	DEFAULT_SELECTOR = "#m .content a";

// wait a little initially for db connection to init
setTimeout(start, 1000);

// start workers!
function start() {
	_.times(5, getJob);
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
		console.log('processing - ' + job.url);
		processPage(job);
	}
}

function processPage(job) {
	var url = job.url
	,	selector = job.selector;

	downloadPage(url, function(err, body) {
		if(err) {
			jobCompleted(err, job);
			return;
		}

		// get video link
		var $html = $(body)
		,	$video = $html.find('#player iframe')
		,	url = $video.attr('src');

		// see if video is present
		// if not, process the links on the page
		if(url) {
			processVideo($html, job);
		} else {
			processLinks($html, job);
		}
	});
}

function processVideo(html, job) {
	var $html = html;

	// get video link
	var $video = $html.find('#player iframe')
	,	url = $video.attr('src');

	// force html5 video
	url += "&html5=1";

	// get episode metadata
	var title = $html.find('title').text()
	,	match = (/(.+)\s-\sepisode\s(\d+)/i).exec(title);

	// make sure we get the required metadat before continuing
	if(!match || match.length !== 3) { 
		jobCompleted(new Error('unable to get video metadata from title - ' + title), job);
		return;
	}

	async.waterfall([

		// download page
		function(done) { downloadPage(url, done); },

		// get the video url and save video
		function(body, done) {
			var url = $(body).find('video source').attr('src')
			,	series = match[1]
			,	episode = match[2];

			// upsert to db
			Video.findOneAndUpdate(
				{ series: series, episode: episode },
				{ series: series, episode: episode, url: url },
				{ upsert: true },
				done
			);
		}

	], function(err) { jobCompleted(err, job); });
}

function processLinks(html, job) {
	var $html = html
	,	selector = job.selector
	,	links = $html.find(selector);

	var urls = links.filter(function(link) {
		var href = $(this).attr('href');
		return href && href.toLowerCase().indexOf(BASE_URL) >= 0; 
	}).map(function(i, link) {
		return $(this).attr('href');
	});

	async.each(urls, function(url, done) {
		Job.create(url, DEFAULT_SELECTOR, done);
	}, function(err) { 
		jobCompleted(err, job);
	});
}

function jobCompleted(err, job) {
	if(err) {
		job.state = 'error';
		job.message = err.message;
		job.save();
	} else {
		job.state = 'complete';
		job.save();
	}

	// continue processing either way
	process.nextTick(getJob);
}

function waitThenGetJob(err) {
	//console.log('worker waiting for job');
	setTimeout(getJob, 1000);
}

function downloadPage(url, done) {
	request(url, function(err, res, body) {
		if(err) done(new Error('download page error - ' + err));
		else if(res.statusCode !== 200) done(new Error('download page error - ' + res.statusCode));
		else done(null, body);
	});
}