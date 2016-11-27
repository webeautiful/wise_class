import socket from './socket'

const parseCookie = (key, cookie) => {
  let reg = new RegExp(key+'=([^;]*);');
  let res = cookie.match(reg);
  if(res && res[1]) {
  return decodeURIComponent(res[1]);
  }
  return '';
}

const getUinfo = () => {
  let cookieStr = document.cookie;
  let user = parseCookie('_JUKU_USER', cookieStr);
  user = user? JSON.parse(user): {};
  return user;
}

const emit = (roomId) => {
  let user = getUinfo();
  user.room = roomId;
  socket.emit('authentication', user);
  return user;
}

export default {
  getUinfo,
  emit
}
