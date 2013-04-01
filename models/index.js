////////////
// Models //
////////////

var connectionString = require('../config').db
, 	mongoose = require('mongoose');

// initialize database connection
mongoose.connect(connectionString);
mongoose.connection.on('open', function(err, db) {
	if(err) console.log(err);
});

// init models
module.exports.Page = require('./page');
module.exports.Job = require('./job');
module.exports.Video = require('./video');