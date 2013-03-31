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


exports.episodes = function(req, res) {
	var query = req.query
	,	path = query.path
	,	url = BASE_URL + path;

	async.waterfall([

		// download episode page
		function(done) { downloadString(url, done); },

		// get the player url
		function(body, done) { 
			var $body = $(body)
			,	$links = $body.find('.content .lst_episode a');

			// get the episodes metadata
			episodes = _.map($links, function(link) {
				var href = link.href
				,	num = link.childNodes[0].innerHTML
				,	number = Number(num);

				return {
					number: number,
					path: getPath(href)
				};
			});

			done(null, episodes);
		}

	], function(err, episodes) {
		res.send(episodes);
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
