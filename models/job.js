///////////////
// Job Model //
///////////////

var mongoose = require('mongoose')
,	Schema = mongoose.Schema;

// enums
var states = 'pending processing error complete'.split(' ');


// schema definition
var JobSchema = new Schema({

	state: { type: String, required: true, enum: states, default: 'pending' },
	url: { type: String, unique: true, required: true },
	selector: { type: String, required: true }

}, { strict: true });


// register model with mongoose
module.exports = mongoose.model('Job', JobSchema);