'use strict';
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var md5 = require('MD5');
var auth = require('socketio-auth');
var _ = require('underscore');
var API = require('./api');

function authenticate(socket, data, callback) {
    if (!data || !data.k) {
        return callback(new Error("data invalid"));
    }
    const privateKey = 'ciKu-u~Jkuu!';
    let key = md5([data.i, privateKey, data.u].join(''));
    if(key == data.k){
        API.getImg(~~data.i, (img) => {
            data.img = img || getDefaultImg(data.ts)
            callback(null, data)
        }, () => {
            data.img = getDefaultImg(data.ts)
            callback(null, data)
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
    socket.on('vote', (data) => {
        vote(data, user)
    });
    socket.on("getMessage", (d, func) => {
        func(d);
    });
    socket.on('api.getWordList', function (type, callback) {
        API.getWordList({rid: roomId, wordType: type}, (data) => {
            callback(data)
        }, (e) => {
            socket.emit('api.getWordList.error', e)
        });
    });
    socket.on('api.searchSents', (word, callback) => {
        API.searchSents({rid: roomId, word: word}, (data) => {
            callback(data)
        }, (e) => {
            socket.emit('api.searchSents.error', e)
        });
    });
    socket.on('api.addSubject', (subject) => {
        subject.timeStamp = +new Date();
        subject.endTimeStamp = +new Date() + 86400000;
        subject.requestId = roomId;
        subject.userId = user.i;
        API.addSubject(subject, (data) => {
            io.in(roomId).emit('new.subject', data);
        }, (e) => {
        });
    });
    socket.on('api.updateSubject', (subject) => {
        API.updateSubject(subject, (data) => {
            io.in(roomId).emit('subject.update', data);
        }, (e) => {
        });
    });
    socket.on('api.searchSents', (word, callback) => {
        API.searchSents({rid: roomId, word: word}, (data) => {
            callback(data)
        }, (e) => {
            socket.emit('api.searchSents.error', e)
        });
    });
    socket.on('api.addVote', (subject) => {
        subject.requestId = roomId;
        subject.userId = user.i;
        API.addVote(subject, (data) => {
            io.in(roomId).emit('new.vote', data);
        }, (e) => {
        });
    });
    socket.on('api.getOrgDoc', () => {
        API.getOrgDoc({rid: roomId}, (data) => {
            io.in(roomId).emit('orgdoc.update', data);
        }, (e) => {
        });
    });
    socket.on('api.getErrorCollection', () => {
        API.getErrorCollection({rid: roomId}, (data) => {
            io.in(roomId).emit('errorcollection.update', data);
        }, (e) => {
        });
    });
    socket.on('api.getErrorRank', (callback) => {
        API.getErrorRank({rid: roomId}, (data) => {
            callback(data)
        }, (e) => {
        });
    });
    socket.on('api.getSubjects', (callback) => {
        API.getSubjects({rid: roomId}, (data) => {
            callback(data)
        }, (e) => {
        });
    });
    socket.on('api.getTeacherInfo', (uid, callback) => {
        API.getUserInfo(uid, (data) => {
            callback(data)
        }, (e) => {
        });
    });
    socket.on('api.getVotes', (callback) => {
        API.getVotes({rid: roomId}, (data) => {
            callback(data)
        }, (e) => {
        });
    });
    //initSubjects(roomId);
    //initVotes(roomId);
    notice(roomId);
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
//auth(io, {
//    authenticate: authenticate,
//    postAuthenticate: postAuthenticate,
//    timeout: 10000
//});
io.on('connection', function(){
  console.log('ok!');
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
