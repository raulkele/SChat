import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SharedModule } from './shared/shared.module';
import { EventsGateway } from './chat.gateway';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({ isGlobal:true })
  ],
  providers: [EventsGateway],
})
export class AppModule {}
