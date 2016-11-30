'use strict';
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var md5 = require('MD5');
var auth = require('socketio-auth');
var _ = require('lodash');
var API = require('./api');

function authenticate(socket, user, callback) {
  if (!user || !user.k) {
    return callback(new Error("data invalid"));
  }
  const privateKey = 'ciKu-u~Jkuu!';
  let key = md5([user.i, privateKey, user.u].join(''));
  if(key == user.k){
    API.getImg(~~user.i, (img) => {
      user.img = img || getDefaultImg(user.ts)
      callback(user, user)
    }, () => {
      user.img = getDefaultImg(user.ts)
      callback(null, user)
    })
  }else{
    callback(null, {})
  }
}

function getDefaultImg(ts) {
  return ts === 1 ?
    'http://www.pigai.org/zt/openclass/static/img/teacher.png':
    'http://www.pigai.org/zt/openclass/static/img/student.png'
}

function postAuthenticate(socket, user) {
  const roomId = user.room;
  socket.client.user = user;
  socket.join(roomId);

  socket.on('disconnect', notice.bind(null, roomId));

  socket.on('api.getSubjects', (callback) => {
    API.getSubjects({rid: roomId}, (data) => {
      callback(data)
    }, (e) => {
    });
  });

  notice(roomId);
}

function notice(roomId) {
    if (roomId <= 0) {
      return;
    }
    var students = [];
    var ids = [];

    io.of('/').in(roomId).clients(function(error, clients){
      if (error) throw error;
      if (!(clients.length>0)) return;

      // clients => [Anw2LatarvGVVXEIAAAD]
      _.each(clients, function (socketId) {
        var _socket = io.sockets.connected[socketId];
        if(!_socket){
          return ;
        }
        var user = _socket.client.user;
        if (!_.includes(ids, user.i)) {
          ids.push(user.i);
          if (user.ts == 2) {
            students.push(_socket.client.user);
          }
        }
      });

      io.in(roomId).emit('student.changed', _.map(students, 'u2'));
    });
}

auth(io, {
  authenticate: authenticate,
  postAuthenticate: postAuthenticate,
  timeout: 10000
});

//express api
app.get('/home', (request, response) => {
  var roomId = request.query.roomId || 579361;
  API.getSubjects({rid: roomId}, (data) => {
    response.send(data);
  });
});

http.listen(3000, 'wiseclass.pigai.org', () => {
    console.log('listening on wiseclass.pigai.org:3000');
});
