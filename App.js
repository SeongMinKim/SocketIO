/*var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


//접속시 해제시 console log 에 뜸
 io.on('connection', function(socket){
    console.log('채팅방에 연결되었습니다.');
    socket.on('disconnect',function () {
        console.log('채팅방에서 나갔습니다.');
 });
});


io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('server message', msg);
    });
});



http.listen(3000, function(){
    console.log("connection" );
});
*/
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});



var userList = [];


io.on('connection', function(socket){
    var joinedUser = false;
    var nickname;

    // 유저 입장
    socket.on('join', function(data){
        if (joinedUser) { // 이미 입장 했다면 중단
            return false;
        }

        nickname = data;
        userList.push(nickname);
        socket.broadcast.emit('join', {
            nickname : nickname
            ,userList : userList
        });

        socket.emit('welcome', {
            nickname : nickname
            ,userList : userList
        });

        joinedUser = true;
    });


    // 메시지 전달
    socket.on('msg', function(data){
        console.log('msg: ' + data);
        io.emit('msg', {
            nickname : nickname
            ,msg : data
        });
    });


    // 접속 종료
    socket.on('disconnect', function () {
        // 입장하지 않았다면 중단
        if ( !joinedUser) {
            console.log('--- not joinedUser left');
            return false;
        }

        // 접속자목록에서 제거
        var i = userList.indexOf(nickname);
        userList.splice(i,1);

        socket.broadcast.emit('left', {
            nickname : nickname
            ,userList : userList
        });
    });
});