import io from 'socket.io-client'

class SocketService {

  constructor() {
    this.init()
  }

  init() {
    const socketUrl =  'http://wiseclass.pigai.org:3000';
    const nsp = '/';
    this.socket = io(socketUrl+nsp);
  }

  connect(cb) {
    this.socket.on('connect', () => {
      console.log('server connected.');
      cb();
    });
  }

  disconnect(cb) {
    this.socket.on('disconnect', () => {
      cb();
    });
  }


}

//SocketService.$inject = [
//]

export default SocketService
