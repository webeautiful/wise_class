import {socketUrl} from './config'
import io from 'socket.io-client'

const socket = io(socketUrl);

socket.on('connect', () => {
  console.log('ok1');

  socket.emit('authentication', 579361);
  socket.on('authenticated', (data) => {
    console.log(data)
    socket.emit('api.getSubjects', (data) => {
      console.log(data);
    });
  });

});

socket.on('disconnect', () => {});
