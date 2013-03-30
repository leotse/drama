/////////////////
// Main Routes //
/////////////////

// dependencies
var _ = require('underscore')
,	$ = require('jquery')
,	url = require('url')
,	request = require('request')
,	async = require('async');


// constants
var BASE_URL = "http://azdrama.net";


exports.index = function(req, res) {
	async.waterfall([

		// download drama home
		function(done) { downloadString(BASE_URL, done); },

		// get the featured shows
		function(body, done) {
			var links = $(body).find('ul.movies > a > img').parent();
			var featured = _.map(links, function(link) {
				var title = link.title
				,	src = link.childNodes[0].src
				,	href = link.href
				,	path = getPath(href);

				return {
					path: path,
					title: title,
					image: src
				};
			});
			done(null, featured);
		}

	], function(err, featured) {
		res.render('index', { featured: featured });
	});
};


exports.series = function(req, res) {
	var query = req.query
	,	path = query.path
	,	url = BASE_URL + path;

	async.waterfall([

		// download series page
		function(done) { downloadString(url, done); },

		// get the list of episodes
		function(body, done) {
			var links = $(body).find('ul.listep a');
			var episodes = _.map(links, function(episode) {
				return {
					title: episode.title,
					path: getPath(episode.href)
				}
			});
			done(null, episodes);
		}

	], function(err, episodes) {
		res.render('series', { episodes: episodes });
	});
};

exports.episode = function(req, res) {
	var query = req.query
	,	path = query.path
	,	url = BASE_URL + path;

	async.waterfall([

		// download episode page
		function(done) { downloadString(url, done); },

		// get the player url
		function(body, done) { 
			var url = $(body).find('#player iframe').attr('src');
			url += "&html5=1";
			done(null, url);
		},

		// download the player page
		function(url, done) { downloadString(url, done); },

		// get the video url
		function(body, done) {
			var url = $(body).find('video source').attr('src');
			done(null, url);
		}
	], function(err, result) {

		// finally render the page!
		res.render('video', { video: result });
	});
};


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
