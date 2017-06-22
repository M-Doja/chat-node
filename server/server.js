const express = require('express'),
      path = require('path'),
      port = process.env.PORT || 3000,
      socketIO = require('socket.io'),
      http = require('http'),
      {generateMessage} = require('./utils/message'),
      app = express();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(path.join(__dirname, '/../public')))

io.on('connection', (socket) => {
  console.log('New User Connected');

  socket.emit('newMessage', generateMessage('Admin','Welcome to Chat Node'));

  socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'));


  socket.on('createMessage', (message, cb) => {
    console.log(`createMessage`, message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    cb('This is from the server');
    // callback();
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('disconnect', ()  => {
    console.log('Client has disconnected');
  });


});


server.listen(port, ()  => {
  console.log(`App listening on port ${port}`);
});
