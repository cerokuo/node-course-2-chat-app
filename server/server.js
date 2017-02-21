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

	//create and send an event.
	socket.emit('newEmail', {
		from: 'pepe@example.com',
		text: 'Hey, What is going on',
		createdAt: 123
	})

	socket.on('createEmail', (newEmail) => {
		console.log('createEmail', newEmail);
	})


	socket.on('disconnect', () => {
		console.log('user vas disconnected');
	});


	socket.emit('newMessage', {
		from: 'iffy',
		text: 'testing the new chat app',
		createdAt: Date.now()
	})

	socket.on('createMessage', (message) => {
		console.log('Message received from the client', message);
	});


})

server.listen(port, function() {
	console.log(`Server is up on ${port}`);
});