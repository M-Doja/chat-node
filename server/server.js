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

  socket.on('disconnect', () => {
    console.log('Client has disconnected');
  });
});


server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
