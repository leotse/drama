// run when dom is ready

$(document).ready(function() {

	// get list of episodes
	var path = getPath()
	,	url = '/api/episodes?path=' + path;
	$.getJSON(url, function(episodes) {
		window.episodes = episodes;
		$('video').on('ended', nextVideo);
	});
});


/////////////
// Helpers //
/////////////

function getPath() {

	var query = window.location.search
	,	parts = query.substring(1).split("&");

	var i, part;
	for(i = 0; i < parts.length; i++) {	
		part = parts[i];
		if(part.indexOf('path=') === 0) {
			return part.substring(5);
		}
	}

	return null;
}

function nextVideo() {
	var episodes = window.episodes
	,	path = getPath();

	// find the current episodes index
	var i, episode, next = -1;
	for(i = 0; i < episodes.length; i++) {
		episode = episodes[i];
		if(episode.path.toLowerCase() === path.toLowerCase()) {
			break;
		}
	}

	// redirect to next episode if not already watching latest!
	if(i < episodes.length - 1) {
		var path = episodes[i + 1].path
		,	location = window.location
		,	baseUrl = location.origin + location.pathname
		,	nextUrl = baseUrl + '?path=' + path;
		window.location = nextUrl;
	} else {
		alert('already watching latest episode');
	}
}