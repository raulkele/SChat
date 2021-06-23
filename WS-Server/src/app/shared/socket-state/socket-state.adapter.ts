import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import socketio from 'socket.io';

import { RedisPropagatorService } from '@app/shared/redis-propagator/redis-propagator.service';

import { SocketStateService } from './socket-state.service';
import { v5 as uuidv5 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { MessageMappingProperties } from '@nestjs/websockets';
import { Observable, fromEvent, EMPTY } from 'rxjs';
import { share, first, mergeMap, filter, takeUntil } from 'rxjs/operators';

import {
  CLOSE_EVENT,
} from '@nestjs/websockets/constants';

enum READY_STATE {
  CONNECTING_STATE = 0,
  OPEN_STATE = 1,
  CLOSING_STATE = 2,
  CLOSED_STATE = 3,
}
interface TokenPayload {
  readonly chatId: string;
}

export interface AuthenticatedSocket extends socketio.Socket {
  auth: TokenPayload;
}

export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {
  public constructor(
    private readonly app: INestApplicationContext,
    private readonly socketStateService: SocketStateService,
    private readonly redisPropagatorService: RedisPropagatorService,
    private readonly configService: ConfigService,
  ) {
    super(app);
  }

  public create(port: number, options: socketio.ServerOptions = {}): socketio.Server {
    const server = super.createIOServer(port, options);
    this.redisPropagatorService.injectSocketServer(server);

    server.use(async (socket: AuthenticatedSocket, next) => {
      const token = socket.handshake.query?.token || socket.handshake.headers?.authorization;

      if (!token) {
        socket.disconnect();
        return;
      }

      try {
        socket.auth = {
          chatId: token
        };

        return next();
      } catch (e) {
        return next(e);
      }
    });

    return server;
  }

  public bindClientConnect(server: socketio.Server, callback: Function): void {
    server.on('connection', (socket: AuthenticatedSocket) => {
      if (socket.auth) {
        if (this.socketStateService.get(socket.auth.chatId)?.length >= 2) {
          console.log('invalid connection attempt');
          socket.disconnect();
          return;
        }
        console.log('user connected');
        this.socketStateService.add(socket.auth.chatId, socket);
        
        const uuid = uuidv5(socket.auth.chatId, this.configService.get<string>('NAMESPACE'));
        console.log(`For chat: ${socket.auth.chatId}, key is: ${uuid}`);
        socket.emit('key', uuid);
        const chatMembers = this.socketStateService.get(socket.auth.chatId);
        chatMembers.forEach(socket => {
          socket.emit('connections', chatMembers.length);
        });
        socket.on('disconnect', () => {
          this.socketStateService.remove(socket.auth.chatId, socket);
          const chatMembers = this.socketStateService.get(socket.auth.chatId);
          chatMembers.forEach(socket => {
            socket.emit('connections', chatMembers.length);
          });
          socket.removeAllListeners('disconnect');
        });
      }

      callback(socket);
    });
  }

}
