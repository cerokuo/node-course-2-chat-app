const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const {generateMessage, generateLocationMessage} = require('./utils/message');
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

	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app' ));
	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined the chat'));

	socket.on('createEmail', (newEmail) => {
		console.log('createEmail', newEmail);
	})

	socket.on('disconnect', () => {
		console.log('user vas disconnected');
	});

	socket.on('createMessage', (message, callback) => {
		console.log('Message received from the client', message);
		//its io instead of socket, because we want to emit to everybody
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback();
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin',coords.latitude, coords.longitude));
	});


})

server.listen(port, function() {
	console.log(`Server is up on ${port}`);
});