////////////
// Config //
////////////
var config = {};

// determine environemtn
var isProd = process.env.PORT;
if(!isProd) { 
	// dev environment!

	// db config
	config.db = "mongodb://localhost:27017";

} else { 
	// prod environment!

}


// export
module.exports = config;