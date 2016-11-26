'use strict';
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var md5 = require('MD5');
var auth = require('socketio-auth');
var _ = require('lodash');
var API = require('./api');

function authenticate(socket, roomId, callback) {
    var cookieStr = socket.request.headers.cookie;
    var user = parseCookie('_JUKU_USER', cookieStr);
    user = JSON.parse(user);

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
function postAuthenticate(socket, roomId) {
    //const roomId = user.room;
    //socket.client.user = user;
    //socket.join(roomId);

    //socket.on('disconnect', notice.bind(null, roomId));

    socket.on('api.getSubjects', (callback) => {
      API.getSubjects({rid: roomId}, (data) => {
        callback(data)
      }, (e) => {
      });
    });
    ////initSubjects(roomId);
    ////initVotes(roomId);
    //notice(roomId);
}
function initSubjects(roomId) {
    API.getSubjects({rid: roomId}, (data) => {
        io.in(roomId).emit('subjects.init', {subjects: data});
    }, (e) => {

    })
}
function initVotes(roomId) {
    API.getVotes({rid: roomId}, (data) => {
        io.in(roomId).emit('votes.init', {votes: data});
    }, (e) => {

    })
}
function vote(data, user) {
    const idx = data.idx || 0;
    if (subjects.find(subject => subject.idx == idx)) {
        votes[idx] = votes[idx] || []
        if (!votes[idx].find(item => item.uid == user.i)) {
            const newVote = {
                uid: user.i,
                name: user.u2,
                vote: data.votes,
                time: +new Date(),
                img: ''
            }
            votes[idx].push(newVote)
            io.in(user.room).emit('new vote', {idx, vote: newVote})
        }
    }
}
function notice(roomId) {
    if (roomId <= 0) {
        return;
    }
    var students = [];
    var ids = [];
    var room = io.nsps['/'].adapter.rooms[roomId];
    if (!room) {
        return;
    }
    var sockets = Object.keys(room.sockets);
    _.each(sockets, function (socketId) {
        var _socket = io.sockets.connected[socketId];
        if(!_socket){
            return ;
        }
        var user = _socket.client.user;
        if (!_.contains(ids, user.i)) {
            ids.push(user.i);
            if (user.ts == 2) {
                students.push(_socket.client.user);
            }
        }
    });
    io.in(roomId).emit('student.changed', _.pluck(students, 'u2'));
}

function parseCookie(key, cookie) {
  var reg = new RegExp(key+'=([^;]*);');
  var res = cookie.match(reg);
  if(res && res[1]) {
    return decodeURIComponent(res[1]);
  }
  return '';
}

auth(io, {
    authenticate: authenticate,
    postAuthenticate: postAuthenticate,
    timeout: 10000
});
app.get('/home', (request, response) => {
  var roomId = request.query.roomId || 579361;
  API.getSubjects({rid: roomId}, (data) => {
    response.send(data);
  });
});

//io.on('connection', function(client){
//  console.log('ok!');
//
//  client.on('api.getSubjects', (roomId) => {
//    var cookieStr = client.request.headers.cookie;
//    var user = parseCookie('_JUKU_USER', cookieStr);
//    user = JSON.parse(user);
//    io.emit('api.getSubjects', null, user);
//    //API.getSubjects({rid: roomId}, (data) => {
//    //  io.emit('api.getSubjects', data, client.request.headers.cookie);
//    //})
//  })
//});

http.listen(3000, 'wiseclass.pigai.org', () => {
    console.log('listening on wiseclass.pigai.org:3000');
});
