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

	jQuery('#message-form').on('submit', function(e) {
		e.preventDefault(); 

		socket.emit('createMessage', {
			from: 'User',
			// getting the message inside the submit by the name.
			text: jQuery('[name=message]').val()
		}, function() {

		});
	});
	
