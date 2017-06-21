const express = require('express'),
      path = require('path'),
      port = process.env.PORT || 3000,
      socketIO = require('socket.io'),
      http = require('http'),
      app = express();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(path.join(__dirname, '/../public')));

io.on('connection', (socket) => {
  console.log('New User Connected');

  socket.emit('newMessage', {
    from: "Tim",
    text: "Hey can you come in at 7 instead?",
    createdAt: 23411
  });

  socket.on('createMessage', function(message) {
    console.log(`createMessage`, message);
  });

  socket.on('disconnect', function () {
    console.log('Client has disconnected');
  });


});


server.listen(port, function () {
  console.log(`App listening on port ${port}`);
});
