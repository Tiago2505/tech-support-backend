import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities';
import { AuthMiddleware } from 'src/common/middlewares';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { AuditModule } from 'src/audit/audit.module';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [TypeOrmModule.forFeature([Ticket]), ConfigModule, UsersModule, AuditModule]
})
export class TicketsModule {


  configure(consumer: MiddlewareConsumer){
    consumer.apply(AuthMiddleware).forRoutes('tickets');
  }

}
