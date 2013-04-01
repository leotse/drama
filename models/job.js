///////////////
// Job Model //
///////////////

var mongoose = require('mongoose')
,	Schema = mongoose.Schema;

// enums
var states = 'pending processing error complete'.split(' ');


// schema definition
var JobSchema = new Schema({

	state: { type: String, required: true, index: true, enum: states, default: 'pending' },
	message: { type: String },

	url: { type: String, unique: true, required: true },
	selector: { type: String, required: true }

}, { strict: true });


// static
JobSchema.statics.create = function(url, selector, done) {
	var JobModel = mongoose.model('Job')
	,	job = new JobModel;

	// set the properties and save
	job.url = url
	job.selector = selector;
	job.save(done);
};

// register model with mongoose
module.exports = mongoose.model('Job', JobSchema);