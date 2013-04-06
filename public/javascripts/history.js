//////////////////////
// Local History JS //
//////////////////////

var lh = {};

// loads the history
lh.load = function() {
	var storage = window.localStorage;
	if(storage) {
		var history = storage['history'];

		// see if we need to init history storage
		if(!history) {
			history = [];
		} else {
			try {
				history = JSON.parse(history);
			} catch(ex) {
				history = [];
			}
		}
		return history;
	}
	return null;
};

// load an episode from history
lh.loadEpisode = function(id) {
	var storage = window.localStorage;
	if(storage) {
		var history = lh.load();
		return _.find(history, function(item) {
			return id === item._id;
		});
	}
}

// saves the given episode
// if it is already in the history, move it to pos 1
lh.save = function(episode) {
	var storage = window.localStorage;
	if(storage) {
		var history = lh.load();
		
		// see if an item in the same series is already in history
		// if it is, move it to pos 1 + update episode
		var index = indexOf(history, episode);
		if(index < 0) {
			history.splice(0, 0, episode);
		} else {
			history.splice(index, 1); // remove the old episode
			history.splice(0, 0, episode); // and add the new one
		}

		// make sure it's less than 5 items
		if(history.length > 5) {
			history = history.slice(0, 5);
		}

		// save back to local storage
		storage['history'] = JSON.stringify(history);
	}
};

// save current progress
lh.updateProgress = function(episode, progress) {
	var storage = window.localStorage;
	if(storage) {
		var history = lh.load();
	}
};

// helper to find the index of an episode
function indexOf(history, episode) {
	var i, item;
	for(i = 0; i < history.length; i++) {
		item = history[i];
		if(item.series === episode.series) {
			return i;
		}
	}
	return -1;
}