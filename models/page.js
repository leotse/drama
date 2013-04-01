////////////////
// Page Model //
////////////////

var mongoose = require('mongoose')
,	Schema = mongoose.Schema;


// schema definition
var PageSchema = new Schema({
	url: { type: String, required: true },
	html: { type: String, required: true }

}, { strict: true });


// register model with mongoose
module.exports = mongoose.model('Page', PageSchema);