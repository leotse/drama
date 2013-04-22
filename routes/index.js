/////////////////
// Main Routes //
/////////////////

// dependencies
var _ = require('underscore')
,	url = require('url')
,	request = require('request')
,	async = require('async')
,	models = require('../models')
,	Video = models.Video;

exports.index = function(req, res) {
	res.render('home');
};

exports.search = function(req, res) {
	var query = req.query
	,	term = query.term
	,	regex = new RegExp(term, 'i');

	// don't do anything for empty searches
	if(!term) { 
		res.render('search', { episodes: [], term: '' });
		return;
	}

	// easter egg - return all shows
	if(term === 'butz') {
		regex = new RegExp('', 'i');
	}

	Video
	.find()
	.select('_id series episode date url')
	.regex('series', regex)
	.sort('-episode')
	.exec(function(err, videos) {
		if(err) res.send(err);
		else res.render('search', { episodes: videos, term: term });
	});
};

exports.episode = function(req, res) {
	var params = req.params
	,	id = params.id;

	Video.findById(id, function(err, video) {
		if(err || !video) res.send(404);
		else {
			res.render('player', { episode: video });
		}
	});
};

exports.explore = function(req, res) {
	Video.find().distinct('series', function(err, series) {
		if(err) res.send(err);
		else res.render('explore', { series: series });
	});
};