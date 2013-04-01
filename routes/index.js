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
	res.render('home');
};

exports.search = function(req, res) {
	var query = req.query
	,	term = query.term
	,	regex = new RegExp(term, 'i');

	Video
	.find()
	.select('_id series episode url')
	.regex('series', regex)
	.sort('-episode')
	.exec(function(err, videos) {
		if(err) res.send(err);
		else res.render('search', { episodes: videos });
	});
};

exports.episode = function(req, res) {
	var params = req.params
	,	id = params.id;

	Video.findById(id, function(err, video) {
		if(err) res.send(err);
		else {
			res.render('player', { episode: video });
		}
	});
};