// called when page is loaded
$(document).ready(function() {
	$('video').on('ended', nextVideo);
	$('#player .next').on('click', nextVideo);
	$('#player .prev').on('click', prevVideo);
});

// gets called when page is loaded to pass id
function init(id) {
	var url = '/api/siblings/' + id;
	$.getJSON(url, function(siblings) {
		window.siblings = siblings;
	});
}

function nextVideo() {
	var siblings = window.siblings
	,	next = siblings.next;

	if(next) {
		playVideo(next);
	} else {
		alert('already watching latest');
	}
}

function prevVideo() {
	var siblings = window.siblings
	,	prev = siblings.prev

	if(prev) {
		playVideo(prev);
	} else {
		alert('already watching oldest');
	}
}

function playVideo(video) {
	if(video) {
		var path = '/episode/' + video._id;
		window.location = path;
	}
}