import {socketUrl} from '../config'
import io from 'socket.io-client'

const socket = io(socketUrl);

export default socket
