import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketStateService {
  private socketState = new Map<string, Socket[]>();

  public remove(chatId: string, socket: Socket): boolean {
    const existingSockets = this.socketState.get(chatId);

    if (!existingSockets) {
      return true;
    }

    const sockets = existingSockets.filter(s => s.id !== socket.id);

    if (!sockets.length) {
      this.socketState.delete(chatId);
    } else {
      this.socketState.set(chatId, sockets);
    }

    return true;
  }

  public add(chatId: string, socket: Socket): boolean {
    const existingSockets = this.socketState.get(chatId) || [];

    const sockets = [...existingSockets, socket];

    this.socketState.set(chatId, sockets);

    return true;
  }

  public get(chatId: string): Socket[] {
    return this.socketState.get(chatId) || [];
  }

  public getAll(): Socket[] {
    const all = [];

    this.socketState.forEach(sockets => all.push(sockets));

    return all;
  }
}
