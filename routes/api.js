////////////////
// API Routes //
////////////////

// dependencies
var _ =  require('underscore')
,	async = require('async')
,	models = require('../models')
,	Video = models.Video;


// get the siblings of this video (prev and next)
exports.siblings = function(req, res) {

	var params = req.params
	,	id = params.id;

	async.waterfall([

		// retrieve the requested video
		function(done) { Video.findById(id, done); },

		// now try getting the siblings
		function(video, done) {
			Video
			.find()
			.where('series', video.series)
			.sort('-episode')
			.exec(done);
		}

	], function(err, videos) {
		if(err) res.send(err);
		else {
			var i, video
			for(i = 0; i < videos.length; i++) {
				video = videos[i];
				if(video._id == id) {
					break;
				}
			}

			// hopefully we found the id here
			if(i < videos.length) {

				var siblings = {};

				// prev episode
				if(i < videos.length - 1) {
					siblings.prev = videos[i + 1];
				}

				// next episode
				if(i > 0) {
					siblings.next = videos[i - 1];
				}

				// send to client
				res.send(siblings);

			} else {
				res.send('not found');
			}
		}
	});
};