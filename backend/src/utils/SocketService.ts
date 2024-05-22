import { Injectable } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:4000/', {
      transports: ['websocket'],
    });
  }

  getSocket(): Socket {
    return this.socket;
  }
}
