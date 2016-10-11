
var http = require('http');/*'http' 包创建web服务器*/
var express = require('express');/*'express' 包管理请求响应模块*/
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
//express 返回静态页面
app.use(express.static(__dirname + '/www'));
server.listen(8081);

//socket handler
io.on('connection',function(socket){
	socket.on('foo',function(data){
		console.log(data);
	});
});
