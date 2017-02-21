const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;

var app = express();


//we create a server using http, using app.listen que are using
//the same http.createServer method
var server = http.createServer(app)
var io = socketIO(server);

app.use(express.static(publicPath));


//listen specific events
io.on('connection', (socket) => {
	console.log('new user connected');

	socket.emit('newMessage', {
		from: 'Admin',
		text: 'Welcome to the chat app',
		createdAt: new Date().getTime()

	});

	socket.broadcast.emit('newMessage', {
		from: 'Admin',
		text: 'New user joined the chat',
		createdAt: new Date().getTime()
	});


	socket.on('createEmail', (newEmail) => {
		console.log('createEmail', newEmail);
	})

	socket.on('disconnect', () => {
		console.log('user vas disconnected');
	});

	socket.on('createMessage', (message) => {
		console.log('Message received from the client', message);
		//its io instead of socket, because we want to emit to everybody
		io.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		});

		//emit the event to everybody but this socket
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });
	});


})

server.listen(port, function() {
	console.log(`Server is up on ${port}`);
});