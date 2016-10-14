/*定义聊天类webchat*/
function webchat(){
	this.socket = null;
}

webchat.prototype.toggleModal = function(data){
    $('#myModal').modal("show");
	document.getElementById('myModalLabel').innerHTML = data;
	setTimeout("$('#myModal').modal('hide')",500);
};

webchat.prototype.displayMsg = function(user,msg,color){
	var obj_messageShow = document.getElementById('messageShow');
	var obj_msg = document.createElement('p');
	var date = new Date().toTimeString().substr(0,8);
	obj_msg.style.color = color || '#000';
	obj_msg.innerHTML = user + "<span class='timespan'>(" + date + "):</span>" + msg;
	obj_messageShow.appendChild(obj_msg);
};

webchat.prototype.init = function(){
	var obj_loginBtn = document.getElementById('login_btn');
	var obj_login_page = document.getElementById('login_page');
	var obj_chat_page = document.getElementById('chat_page');
	var obj_sendBtn  = document.getElementById('sendBtn');
	var self = this;
	self.socket = io.connect();
	//处理连接到了服务器，关闭模态框过程
	self.socket.on('connect',function(){
		self.toggleModal("成功连接");
	});

	//处理登录失败(名字重复)过程
	self.socket.on('user_name_exist',function(data){
		self.toggleModal("您的名字'" + data + "'已被占用！");
	});

	//处理登录成功过程
	self.socket.on('login_success',function(data){
		self.toggleModal("登录成功");
		obj_login_page.style.display = "none";
		obj_chat_page.style.display = "block";
	});

	//处理广播信息
	self.socket.on('system',function(name,type){
		var color = (type=='joined' || type=='left')?'red':'green';
		//显示加入或离开信息
		self.displayMsg(name,type,color);
	});

	//给login_btn添加事件监听
	obj_loginBtn.onclick = function(){
		var username_value = document.getElementById('username').value;
		if(username_value == '')
		{
			self.toggleModal("名字不能为空");
			document.getElementById('username').focus();
		}
		else
		{
			self.socket.emit('login',username_value);				
		}
		document.getElementById('username').value = "";
	};

	//给sendBtn添加事件监听
	obj_sendBtn.onclick = function(){
		var send_value = document.getElementById('messageInput').value;
		if(send_value == '')
		{
			self.toggleModal("发送内容不能为空");
			document.getElementById('messageInput').focus();
		}
		else
		{
			//向自己显示发送的内容
			self.displayMsg('me',send_value,'green');
			//向服务器说我发送的内容,服务器知道之后就向所有客户端广播你的内容
			self.socket.emit('postMsg',send_value);
		}
		document.getElementById('messageInput').value = '';
	};
};


window.onload = function(){
	var Webchat = new webchat();
	Webchat.init();
};