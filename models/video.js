/////////////////
// Video Model //
/////////////////

var mongoose = require('mongoose')
,	Schema = mongoose.Schema;


// schema definition
var VideoSchema = new Schema({

	url: { type: String, required: true, unique: true },
	series: { type: String, required: true },
	episode: { type: Number },
	date: { type: Date }

}, { strict: true, autoIndex: true });

VideoSchema.index({ series: 1, episode: 1, date: 1 }, { unique: true });

// register model with mongoose
module.exports = mongoose.model('Video', VideoSchema);