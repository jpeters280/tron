var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
})

var deaths = 0;

var players = {};

io.on('connection', function(socket) {

  socket.on('created', function(player) {
    players[socket.id] = player;
    socket.emit('id', socket.id);
    io.emit('re', players);
  });
  socket.on('disconnect', function() {
    delete players[socket.id]
    io.emit('re', players);
  });
  socket.on('dead', function() {
    deaths++;
    delete players[socket.id];
    io.emit('sync');
  });
  socket.on('keyUpdate', function(player){
    players[socket.id] = player;
    io.emit('sync');
  });
  socket.on('syncReady', function(player) {
    players[socket.id] = player;
    io.emit('re', players);
  })

})


http.listen(process.env.PORT || 3000);
// http.listen(process.env.PORT, process.env.IP);
