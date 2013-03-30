/////////////////
// Main Routes //
/////////////////

// dependencies
var $ = require('jquery')
,	request = require('request')
,	async = require('async');

exports.index = function(req, res) {
	res.render('index');
};

exports.process = function(req, res) {
	var body = req.body
	,	url = body.url;

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
