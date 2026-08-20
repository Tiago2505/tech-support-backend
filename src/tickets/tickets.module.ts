import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [TypeOrmModule.forFeature([Ticket])]
})
export class TicketsModule {}
