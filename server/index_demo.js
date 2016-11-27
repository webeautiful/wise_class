'use strict';
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var API = require('./api');

io.on('connection', function(client){
  console.log('ok!');

  client.on('api.getSubjects', (roomId, callback) => {
    API.getSubjects({rid: roomId}, (data) => {
      callback(data)
    })
  })
});

http.listen(3000, 'wiseclass.pigai.org', () => {
    console.log('listening on wiseclass.pigai.org:3000');
});
