// called when page is loaded
$(document).ready(function() {
	var history = lh.load();
	if(history) {
		var $recent = $('#footer .recent');
		_.each(history, function(item) {
			// clean the series title
			var index = item.series.indexOf('-') + 1
			,	title = item.series.substring(index);

			// create link for history item
			var a = document.createElement('a');
			a.className = "footer";
			a.href = '/episode/' + item._id;
			a.alt = title;
			a.innerHTML = title;

			// and append to dom
			$recent.append(a);
			$recent.show();
		});
	}
});

// gets called when page is loaded to pass id
function init(id) {
	var url = '/api/siblings/' + id;
	$.getJSON(url, function(siblings) {
		window.siblings = siblings;
		lh.save(siblings.current);
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