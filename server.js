
var http = require('http');/*'http' ������web������*/
var express = require('express');/*'express' ������������Ӧģ��*/
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
//express ���ؾ�̬ҳ��
app.use(express.static(__dirname + '/www'));
server.listen(8081);

//socket handler
io.on('connection',function(socket){
	socket.on('foo',function(data){
		console.log(data);
	});
});
