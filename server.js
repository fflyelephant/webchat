var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
//用户名字列表
var users = new Array();

app.use(express.static(__dirname + '/www'));
server.listen(8081);

//socket handler
io.on('connection',function(socket){
	//服务器接收名字处理
	socket.on('login',function(user_name){
		if(users.indexOf(user_name) > -1)
		{
			socket.emit('user_name_exist',user_name);
		}
		else
		{
			users.push(user_name);
			socket.userName = user_name;//将此连接的用户名字记下来
			socket.emit('login_success',user_name);//向本客户端说登录成功
			socket.broadcast.emit("system",socket.userName,'joined');//向所有其它客户端说我登录了
		}
	});

	//'disconnect'是socket.io自带事件,当一个用户断开连接时触发
	socket.on('disconnect',function(){
		users.splice(users.indexOf(socket.userName),1);//找到用户名字并从数组中删除它 
		socket.broadcast.emit("system",socket.userName,'left');//向所有其它客户端说我退出了
	});

	//服务器接收客户端来的聊天内容
	socket.on('postMsg',function(data){
		//将此客户端的聊天内容和客户端名字广播出去
		socket.broadcast.emit("system",socket.userName,data);
	})
});
