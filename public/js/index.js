	//store the socket in a variable and need to listen and send data from the server.
	var socket = io();

	//log in chrome console when you have connected with the server
	socket.on('connect', function() {
		console.log('connected to the server');

		socket.emit('createEmail', {
			to: 'jen@example.com',
			text: 'this is Ivan'
		});
		
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

		socket.emit('createMessage', {
			from: 'ALberto',
			text: 'Message received in the client, I send this to you, server'
		});
	});