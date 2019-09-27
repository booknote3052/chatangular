// Setup basic express server
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var inout = Number('0');
var clients = 0;
app.get('/', (req, res) => {
    res.end('test');
})
/*
io.on('connection', (socket) => {
    console.log('a client connected');
})
*/

io.on('connection', (socket) => {

    console.log('new connection made.');
    socket.on('disconnect', function () {

        console.log('disconnection made.');
    })


    socket.on('join', function (data) {
        //joining
        socket.join(data.room);
        inout++;
        console.log(data.user + 'joined the room : ' + data.room + inout);
        //console.log(socket);
        //console.log(option);

        socket.broadcast.to(data.room).emit('new user joined', { user: data.user, message: 'has joined this room.' + inout });
    });


    socket.on('leave', function (data) {
        inout--;
        console.log(data.user + 'left the room : ' + data.room + clients);

        socket.broadcast.to(data.room).emit('left room', { user: data.user, message: 'has left this room.' + inout });

        socket.leave(data.room);
    });
    socket.on('typing', function (data) {


        console.log("typingadd")
        console.log(data)
        io.in(data.room).emit('typingadd', { user: data.user, message: data.message });
        setTimeout(() => {   
            console.log("typingdel")
            io.in(data.room).emit('typingdel', { user: data.user, message: data.message });
        }, 1000);
    })
    socket.on('message', function (data) {
        //console.log(data)
        io.in(data.room).emit('new message', { user: data.user, message: data.message });
    })

});

http.listen(3000, function () {
    console.log('listen on * 3000')
});