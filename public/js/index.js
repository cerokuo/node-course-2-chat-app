	//store the socket in a variable and need to listen and send data from the server.
	var socket = io();

	//log in chrome console when you have connected with the server
	socket.on('connect', function() {
		console.log('connected to the server');
	});

	//log in chrome console when you disconnect from the server
	socket.on('disconnect', function() {
		console.log('User was disconnected');
	});


	socket.on('newEmail', function(email) {
		console.log('New Email', email);
	});


	socket.on('newMessage', function(message) {
		console.log('new message from server', message);
		var li = jQuery('<li></li>');
		li.text(`${message.from}: ${message.text}`);

		jQuery('#messages').append(li);
	});

	socket.on('newLocationMessage', function (message) {
		var li = jQuery('<li></li>');
		var a = jQuery('<a target="_blank">My current location</a>');

		li.text(`${message.from}: `);
		a.attr('href', message.url);
		li.append(a);
		jQuery('#messages').append(li);
	});

// clicking the button message-form will launch this function
	jQuery('#message-form').on('submit', function(e) {
		e.preventDefault(); 

		var messageTextBox = jQuery('[name=message]');

		socket.emit('createMessage', {
			from: 'User',
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
