import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  onEvent(event: string, callback: (data: any) => void): void {
    this.socket.on(event, callback);
  }

  emitEvent(event: string, data: any): void {
    this.socket.emit(event, data);
  }
}
