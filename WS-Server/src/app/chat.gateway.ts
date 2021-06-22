import { UseInterceptors } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Observable, of } from 'rxjs';

import { RedisPropagatorInterceptor } from '@app/shared/redis-propagator/redis-propagator.interceptor';
import { Server, Socket } from 'socket.io';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway()
export class EventsGateway {

  @WebSocketServer() private server: Server;


  @SubscribeMessage('message')
  public messageSent(@ConnectedSocket() client: Socket,@MessageBody() data: string): Observable<any> {
    this.server.emit('message', { event: 'message', data: { data, socketId: client.id} });
    return of({ event: 'message', data });
  }
}
