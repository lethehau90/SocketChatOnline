var express = require('express')
var app = express();
var morgan = require("morgan");

app.use("/assets", express.static(__dirname + "/public"))

app.use(morgan("dev"))
app.set("view engine", "ejs")

var server = require('http').Server(app)
var io = require('socket.io')(server);

var listUsers = []

io.on('connection', function (socket) {
    console.log('người dùng đã kết nối vào ' + socket.id)

    socket.on('disconnect', function () {
        console.log('người dùng đã hủy kết nối vào ' + socket.id)
        listUsers.splice(
            listUsers.indexOf(socket.Username), 1
        );

        socket.broadcast.emit('server-send-list-users', listUsers)
    })

    socket.on('client-send-Username', function (data) {
        if (listUsers.indexOf(data) >= 0) {
            socket.emit('server-send-register-faill', data)
        }
        else {
            listUsers.push(data)
            socket.Username = data

            socket.emit('server-send-register-success', data)

            io.sockets.emit('server-send-list-users', listUsers)

        }
    })

    socket.on('logout', function () {
        listUsers.splice(
            listUsers.indexOf(socket.Username), 1
        );

        socket.broadcast.emit('server-send-list-users', listUsers)
    })

    socket.on('user-send-message', function (data) {
        var object = { userName: socket.Username, message: data }
        io.sockets.emit('server-send-message', object)
    })

    socket.on('client-input-message', function () {
        var s = socket.Username + " đang nhập văn bản"
        io.sockets.emit('server-input-message', s)
    })

    socket.on('client-stop-input-message', function () {
        var s = socket.Username + " ngừng nhập văn bản"
        io.sockets.emit('server-stop-input-message', s)
    })


})

//Settings
var port = process.env.PORT || 4000;

app.get('/', function (req, res) {
    res.render('index')
})

server.listen(port, function () {
    console.log("Smart home API is listening on port: " + port);
});