import auth from './libs/auth'
import socket from './libs/socket'
import moment from 'moment'

const roomId = 579361;

socket.on('connect', () => {
  console.log('ok');
});

auth.emit(roomId);

socket.on('authenticated', (user) => {
  console.log(user)
  socket.emit('api.getSubjects', (data) => {
    console.log(data);
  });
});

socket.on('student.changed', (students) => {
  console.log(students);
})

socket.on('disconnect', () => {});

window.onload = () => {
  const nowTs = Date.now();//ms
  let date = moment(nowTs).format('mm:ss');
  document.getElementById('timer').innerHTML = date;
}
