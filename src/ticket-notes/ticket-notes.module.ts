import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TicketNotesService } from './ticket-notes.service';
import { TicketNotesController } from './ticket-notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketNote } from './entities/ticket-note.entity';
import { TicketsModule } from 'src/tickets/tickets.module';
import { AuthMiddleware } from 'src/common/middlewares';
import { AuditModule } from 'src/audit/audit.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [TicketNotesController],
  providers: [TicketNotesService],
  imports: [
    TypeOrmModule.forFeature([TicketNote]),
    TicketsModule,
    AuditModule,
    UsersModule
  ]
})
export class TicketNotesModule {

  configure(consumer: MiddlewareConsumer){
    consumer.apply(AuthMiddleware).forRoutes('ticket-notes');
  }

}
