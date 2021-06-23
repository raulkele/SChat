import { UseInterceptors } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { EMPTY, Observable, of } from 'rxjs';

import { RedisPropagatorInterceptor } from '@app/shared/redis-propagator/redis-propagator.interceptor';
import { Server, Socket } from 'socket.io';
import { SocketStateService } from './shared/socket-state/socket-state.service';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway()
export class EventsGateway {

  public constructor(private socketStateService: SocketStateService) {}

  @WebSocketServer() private server: Server;


  @SubscribeMessage('send_message')
  public messageSent(@ConnectedSocket() client: Socket,@MessageBody() data: string): Observable<any> {

    const chatId = client.handshake.query?.token || client.handshake.headers?.authorization;
    console.log('Message from ', chatId);
    console.log('With Socket Id', client.id);
    console.log('sockets for this chat',this.socketStateService
    .get(chatId).map(s => s.id));
    this.socketStateService
      .get(chatId)
      .filter((socket) => socket.id !== client.id)
      .forEach(
        (socket) => {
          socket.emit('message', {event: 'message', data: {data, socketId: client.id}});
          console.log('emmiting to others in chat');
      });
    console.log('returning to original sender');
    client.emit('messageSent',data );
    return EMPTY;
  }
}
