
var socketJs = {


    init: function () {

        socketJs.registerEvent()

        socketJs.load()

    },

    registerEvent: function () {

        var socket = io.connect('/') //http://localhost:4000
        socket.on('server-send-register-faill', function (data) {
            alert('Username ' + data + ' này có người đăng ký rồi')
        })

        socket.on('server-send-register-success', function (data) {
            $("#currentUser").html(data)
            socketJs.callShow()
        })

        socket.on('server-send-list-users', function (data) {
            $("#boxContent").html("");
            data.forEach(function (item) {
                $("#boxContent").append("<div class='useronline'>" + item + "</div>")
            })
        })

        socket.on('server-send-message',function(data){
            var html = "";
            html = "<div class='ms'>"+data.userName+" : " + data.message+"</div>"
            $("#listMessage").append(html)
        })

        socket.on('server-stop-input-message', function(data){
            $("#info").html("")
        })

        socket.on('server-input-message', function(data){
            $("#info").html("<img width = '25px' src='/assets/img/typing.gif'/> "+data)
        })

        $("#btnRegister").off('click').on('click', function () {
            socket.emit("client-send-Username", $("#txtUsername").val())
        })

        $("#btnLogout").off('click').on('click', function () {
            socket.emit("logout")
            socketJs.callHide()
        })

        $("#btnSendMessage").off('click').on('click', function () {
            socket.emit('user-send-message', $('#txtMessage').val())
        })

        $("#txtMessage").focusin(function(){
            socket.emit('client-input-message')
        })

        $("#txtMessage").focusout(function(){
            socket.emit('client-stop-input-message')
        })
    },

    callHide: function () {
        $("#loginForm").show(2000);
        $("#chatForm").hide(1000);
    },

    callShow: function () {
        $("#chatForm").show(1000);
        $("#loginForm").hide(2000);
    },

    load: function () {
        $("#loginForm").show();
        $("#chatForm").hide();
    }
}

socketJs.init()