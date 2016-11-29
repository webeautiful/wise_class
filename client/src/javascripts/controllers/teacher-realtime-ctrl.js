class TeacherRealtimeCtrl {

  constructor($state, socketService) {
    this.socketService = socketService;
    this.socket = socketService.socket;
    this.init();
  }

  init() {
    this.data = 'TeacherRealtimeCtrl ok';
    this.roomId = 579361;
    this.socketService.connect(() => {
      this.auth(this.roomId);
    });
    this.notice();
  }

  auth(roomId) {
    let user = this._getUinfo();
    user.room = roomId;

    this.socket.emit('authentication', user);
    this.socket.on('authenticated', (user) => {
      console.log(user)
      this.socket.emit('api.getSubjects', (data) => {
        console.log(data);
      });
    });
  }

  notice() {
    this.socket.on('student.changed', (students) => {
      console.log(students);
    })
  }

  _parseCookie(key, cookie) {
    const reg = new RegExp(key+'=([^;]*);?');
    const res = cookie.match(reg);
    if(res && res[1]) {
      return decodeURIComponent(res[1]);
    }
    return '';
  }

  _getUinfo() {
    const cookieStr = document.cookie;
    let user = this._parseCookie('_JUKU_USER', cookieStr);
    user = user? JSON.parse(user): {};
    return user;
  }

}

TeacherRealtimeCtrl.$inject = [
  '$state',
  'socketService'
]

export default TeacherRealtimeCtrl
