(function() {

	// init module
	var episode = null
	,	siblings = null
	,	id = window.episodeId;

	// get ref to some ui element
	var $video = $('video')
	,	video = $video[0];

	// load episode from history
	episode = lh.loadEpisode(id);

	// fetch siblings
	fetchSiblings();

	// attach some ui events when dom is ready
	$(document).ready(function() {
		// init video player
		$video
			.on('loadedmetadata', videoLoaded)
			.on('timeupdate', progressChanged)
			.on('ended', nextVideo)
			.on('mousewheel', mousewheel);

		// prev/next buttons
		$('#player .next').on('click', nextVideo);
		$('#player .prev').on('click', prevVideo);

		// keyboard shortcuts
		$(document).on('keyup', keyup);
	});


	/////////////
	// Helpers //
	/////////////

	function fetchSiblings() {
		var url = '/api/siblings/' + id;
		$.getJSON(url, function(results) {
			siblings = results
			episode = episode || results.current;
			lh.save(episode);
		});
	}

	function nextVideo() {
		if(siblings) {
			var next = siblings.next;
			if(next) {
				playVideo(next);
			} else {
				alert('already watching latest');
			}
		}
	}

	function prevVideo() {
		if(siblings) {
			var prev = siblings.prev
			if(prev) {
				playVideo(prev);
			} else {
				alert('already watching oldest');
			}
		}
	}

	function playVideo(video) {
		if(video) {
			var path = '/episode/' + video._id;
			window.location = path;
		}
	}


	///////////////
	// UI Events //
	///////////////

	function videoLoaded(e) {
		// resume playback when loaded
		if(episode && episode.progress) {
			video.currentTime = episode.progress;
		}

		// then start playback
		video.play();
	}

	function progressChanged(e) {
		if(episode && video && !video.paused) {
			episode.progress = video.currentTime;
			lh.save(episode);
		}
	}

	function keyup(e) {
		switch(e.keyCode) {
			case 32: // spacebar to toggle play/pause
				var video = $('video')[0];
				if(video) {
					if(video.paused) { video.play(); }
					else { video.pause(); }
				}
				break;
			case 78: // char 'n' to play next video
				nextVideo();
				break;
			case 80: // char 'p' to play previous video
				prevVideo();
				break;
		}
	}

	function mousewheel(e) {
		var deltay = e.originalEvent.wheelDeltaY;
		if(deltay > 0) {
			if(video.muted) {
				video.muted = false;
			} else {
				video.volume += 0.1;
			}
		} else {
			if(video.volume < 0.1) {
				video.muted = true;
			} else {
				video.volume -= 0.1;
			}
		}
		return false;
	}

}());