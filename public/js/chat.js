	//store the socket in a variable and need to listen and send data from the server.
	var socket = io();


	function scrollToBottom() {
		// Selectors
		var messages = jQuery('#messages');

		var newMessage = messages.children('li:last-child');
		// Heights
		var clientHeight = messages.prop('clientHeight');
		var scrollTop = messages.prop('scrollTop');
		var scrollHeight = messages.prop('scrollHeight');
		var newMessageHeight = newMessage.innerHeight();
		var lastMessageHeight = newMessage.prev().innerHeight();

		if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
			messages.scrollTop(scrollHeight);
		}
	}


	//log in chrome console when you have connected with the server
	socket.on('connect', function() {
		//from an string, we have an object
		var params = jQuery.deparam(window.location.search);

		socket.emit('join', params, function(err) {
			if(err) {
				alert(err);
				window.location.href="/";
			} else {
				console.log('no error');

			}

		});
	});

	//log in chrome console when you disconnect from the server
	socket.on('disconnect', function() {
		console.log('User was disconnected');
	});

	socket.on('updateUserList', function(users) {
		var ol = jQuery('<ol></ol>');

		//Print the list of users in the screen
		users.forEach(function(user) {
			ol.append(jQuery('<li></li>').text(user));
		});

		jQuery('#users').html(ol);
	});

	socket.on('newEmail', function(email) {
		console.log('New Email', email);
	});


	socket.on('newMessage', function(message) {

		var formattedTime = moment(message.createdAt).format('h:mm a');
		var template = jQuery('#message-template').html();
		//render the template of the html
		var html = Mustache.render(template, {
			text: message.text,
			from : message.from,
			createdAt: formattedTime
		});

		jQuery('#messages').append(html);
		scrollToBottom();
	});

	socket.on('newLocationMessage', function (message) {
		var formattedTime = moment(message.createdAt).format('h:mm a');
		var template = jQuery('#location-message-template').html();
		var html = Mustache.render(template, {
			url: message.url,
			from : message.from,
			createdAt: formattedTime
		});

		jQuery('#messages').append(html);
		scrollToBottom();
	});

// clicking the button message-form will launch this function
jQuery('#message-form').on('submit', function(e) {
	e.preventDefault(); 

	var messageTextBox = jQuery('[name=message]');

	socket.emit('createMessage', {
			// getting the message inside the submit by the name.
			text: messageTextBox.val()
		}, function() {
			messageTextBox.val('');
		});
});


	//var to take the info from the button
	var locationButton = jQuery('#send-location');

	locationButton.on('click', function(e) {
		if(!navigator.geolocation) {
			return alert('Geolocation not supported by your browser');
		}

		// disable the button after click.
		locationButton.attr('disabled', 'disabled').text('Sending location ...');

		// sending current location.
		navigator.geolocation.getCurrentPosition(function(position) {
			// enable the button to be clicked again
			locationButton.removeAttr('disabled').text('Send location');
			socket.emit('createLocationMessage', {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			});
		}, function() {
			// enable the button to be clicked again
			locationButton.removeAttr('disabled').text('Send location');
			alert('Unable to fetch location');
		});
	});
