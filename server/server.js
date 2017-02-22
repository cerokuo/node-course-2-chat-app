const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;

var app = express();


//we create a server using http, using app.listen que are using
//the same http.createServer method
var server = http.createServer(app)
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));


//listen specific events
io.on('connection', (socket) => {
	console.log('new user connected');


	socket.on('join', (params, callback) => {
		if(!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required');
		}
		socket.join(params.room);
		// remove the user from previous room
		users.removeUser(socket.id);
		// add the user to this new room array
		users.addUser(socket.id, params.name, params.room);

		io.to(params.room).emit('updateUserList', users.getUserList(params.room));

		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app' ));
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', ` ${params.name} has joined`));
		callback();
	})

	socket.on('createEmail', (newEmail) => {
		console.log('createEmail', newEmail);
	})

	socket.on('disconnect', () => {
		var user = users.removeUser(socket.id);

		if(user) {
			//update user list
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			//print a message to all the users but me
			io.to(user.room).emit('newMessage', generateMessage('Admin', ` ${user.name} has left`));
		}
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