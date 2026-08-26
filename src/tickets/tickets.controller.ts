import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketDto } from './dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @Req() req: Request) {
    return this.ticketsService.create(createTicketDto, (req as any).user.id );
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':term')
  findByTerm(@Param('term') term: string | number) {
    return this.ticketsService.findByTerm(term);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTicketDto: UpdateTicketDto, @Req() req: Request) {
    return this.ticketsService.update(id, updateTicketDto, (req as any).user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number,  @Req() req: Request) {
    return this.ticketsService.remove(id, (req as any).user.id);
  }

  @Post('resolve/:id')
  resolve(@Param('id', ParseIntPipe) id: number){
    return this.ticketsService.resolve(id);
  }

  @Post('close/:id')
  close(@Param('id', ParseIntPipe) id: number){
    return this.ticketsService.close(id);
  }
}
