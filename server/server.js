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

	socket.on('disconnect', () => {
		console.log('user vas disconnected');
	});
})

server.listen(port, function() {
	console.log(`Server is up on ${port}`);
});