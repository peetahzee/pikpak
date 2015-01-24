var fbRef = new Firebase('https://pikpak.firebaseio.com/');

$(document).ready(function() {
	fbRef.child('stories').orderByPriority().limitToFirst(10).on('value', function(snapshot) {
		$('#stories').html('');
		stories = snapshot.val();
		for (var key in stories) {
			var story = stories[key];
			var html =  '<div class="story" data-storyId="' + key + '">';
			html += '<div class="score">';
			html += '<i class="fa fa-thumbs-up"></i> ' + story.score + ' <i class="fa fa-thumbs-down"></i>';
			html += '</div>'
			html += '<div class="content">' + story.content + '<br /><div class="time">' + new Date(story.time) + '</div></div>';
			html += '<div class="clear"></div>';
			html += '</div>';
			$('#stories').append(html);
		}

		$('.fa-thumbs-up').click(function(e) {
			storyId = $(this).closest('.story').attr('data-storyId');
			fbRef.child('stories').child(storyId).child('score').transaction(function (current_value) {
  			return current_value + 1;
			});
		});
		$('.fa-thumbs-down').click(function(e) {
			storyId = $(this).closest('.story').attr('data-storyId');
			fbRef.child('stories').child(storyId).child('score').transaction(function (current_value) {
  			return current_value - 1;
			});
		});
	});

	$('form').submit(function(e) {
		var time = new Date().getTime();
		var textareaValue = $(this).find('textarea').val();
		var newPushRef = fbRef.child('stories').push();
		newPushRef.setWithPriority({
			content: textareaValue,
			score: 0,
			time: time
		}, 0 - time)
		return false;
	});


});

