const express = require('express'),
      path = require('path'),
      port = process.env.PORT || 3000,
      socketIO = require('socket.io'),
      http = require('http'),
      {generateMessage, generateLocationMessage} = require('./utils/message'),
      {isRealString} = require('./utils/validation'),
      {Users} = require('./utils/users'),
      app = express();

var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(path.join(__dirname, '/../public')))

io.on('connection', (socket) => {
  console.log('New User Connected');



  socket.on('join', (params, cb) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return cb('Name and room name are required.')
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room)

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('Admin','Welcome to Chat Node'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined the room`));
    cb();
  });

  socket.on('createMessage', (message, cb) => {
    console.log(`createMessage`, message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    cb();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
  });

  socket.on('disconnect', ()  => {

    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });


});


server.listen(port, ()  => {
  console.log(`App listening on port ${port}`);
});
