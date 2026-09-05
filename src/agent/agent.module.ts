import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { OpenaiModule } from 'src/openai/openai.module';
import { TicketsModule } from 'src/tickets/tickets.module';
import { AuthMiddleware } from 'src/common/middlewares';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentConversation } from './entities/agent.entity';
import { TicketNotesModule } from 'src/ticket-notes/ticket-notes.module';

@Module({
  controllers: [AgentController],
  providers: [AgentService],
  imports: [OpenaiModule, TicketsModule, UsersModule, TypeOrmModule.forFeature([AgentConversation]), TicketNotesModule]
})
export class AgentModule {

  configure(consumer: MiddlewareConsumer){
    consumer.apply(AuthMiddleware).forRoutes('agent');
  }

}
