/////////////////
// Video Model //
/////////////////

var mongoose = require('mongoose')
,	Schema = mongoose.Schema;


// schema definition
var VideoSchema = new Schema({

	series: { type: String, required: true },
	episode: { type: Number, required: true },
	url: { type: String, required: true }

}, { strict: true });


// register model with mongoose
module.exports = mongoose.model('Video', VideoSchema);