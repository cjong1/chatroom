var express = require('express');
var path = require('path');
var app = express();
var bodyparser = require("body-parser");
var querystring = require("querystring");
var server = app.listen(6789, function() {
	console.log('Listening on 6789.');
});

app.use(bodyparser.urlencoded());
app.use(express.static(path.join(__dirname, "/static")));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function(request, response){
	response.render("index");
});

var io = require("socket.io").listen(server);
var chat = [];
var users = [];

io.sockets.on("connection", function (socket){
	socket.on("got_new_user", function (data){
		users.push(data);
		io.emit('all_users', users);
	});
	socket.on('user_message_name', function (data) {
		var message = querystring.parse(data[1]);
		chat.push([data[0], message.message]);
		console.log(chat);
		io.emit('all_chat', chat);
	});
});