/////////////////
// Main Routes //
/////////////////

// dependencies
var _ = require('underscore')
,	$ = require('jquery')
,	url = require('url')
,	request = require('request')
,	async = require('async')
,	models = require('../models')
,	Video = models.Video;


// constants
var BASE_URL = "http://azdrama.net";


exports.index = function(req, res) {
	res.render('search');
};

exports.search = function(req, res) {
	var query = req.query
	,	term = query.term
	,	regex = new RegExp(term, 'i');

	Video
	.find()
	.select('-_id series episode url')
	.regex('series', regex)
	.sort('-episode')
	.exec(function(err, videos) {
		if(err) res.send(err);
		else res.send(videos);
	});
};


// exports.index = function(req, res) {
// 	async.waterfall([

// 		// download drama home
// 		function(done) { downloadString(BASE_URL, done); },

// 		// get the featured shows
// 		function(body, done) {
// 			var links = $(body).find('ul.movies > a > img').parent();
// 			var featured = _.map(links, function(link) {
// 				var title = link.title
// 				,	src = link.childNodes[0].src
// 				,	href = link.href
// 				,	path = getPath(href);

// 				return {
// 					path: path,
// 					title: title,
// 					image: src
// 				};
// 			});
// 			done(null, featured);
// 		}

// 	], function(err, featured) {
// 		res.render('index', { featured: featured });
// 	});
// };


// exports.series = function(req, res) {
// 	var query = req.query
// 	,	path = query.path
// 	,	url = BASE_URL + path;

// 	async.waterfall([

// 		// download series page
// 		function(done) { downloadString(url, done); },

// 		// get the list of episodes
// 		function(body, done) {
// 			var links = $(body).find('ul.listep a');
// 			var episodes = _.map(links, function(episode) {
// 				return {
// 					title: episode.title,
// 					path: getPath(episode.href)
// 				}
// 			});
// 			done(null, episodes);
// 		}

// 	], function(err, episodes) {
// 		res.render('series', { episodes: episodes });
// 	});
// };

// exports.episode = function(req, res) {
// 	var query = req.query
// 	,	path = query.path
// 	,	url = BASE_URL + path
// 	,	episodes = null;

// 	async.waterfall([

// 		// download episode page
// 		function(done) { downloadString(url, done); },

// 		// get the player url
// 		function(body, done) { 
// 			var $body = $(body)
// 			,	$links = $body.find('.content .lst_episode a')
// 			,	url = $(body).find('#player iframe').attr('src');

// 			// get the episodes metadata
// 			episodes = _.map($links, function(link) {
// 				var href = link.href
// 				,	num = link.childNodes[0].innerHTML
// 				,	number = Number(num);

// 				return {
// 					number: number,
// 					path: getPath(href)
// 				};
// 			});

// 			// force html video
// 			url += "&html5=1";
// 			done(null, url);
// 		},

// 		// download the player page
// 		downloadString,

// 		// get the video url
// 		function(body, done) {
// 			var url = $(body).find('video source').attr('src')
// 			done(null, url);
// 		}

// 	], function(err, url) {
		
// 		// finally render the player
// 		res.render('player', { url: url });
// 	});
// };


/////////////
// Helpers //
/////////////

function downloadString(url, callback) {
	request(url, function(err, res, body) {
		if(err) callback(err);
		else if (res.statusCode !== 200) callback(new Error('http error ' + res.statusCode));
		else callback(null, body);
	});
}

function getPath(link) {
	var daurl = url.parse(link)
	return daurl.pathname;
}
