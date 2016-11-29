import io from 'socket.io-client'

class SocketService {

  constructor() {
    this.init()
  }

  init() {
    const socketUrl =  'http://wiseclass.pigai.org:3000';
    this.socket = io(socketUrl);
  }

  connect(cb) {
    this.socket.on('connect', () => {
      console.log('ok');
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
