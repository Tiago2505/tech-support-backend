import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { TicketNotesService } from './ticket-notes.service';
import { CreateTicketNoteDto } from './dto/create-ticket-note.dto';
import { UpdateTicketNoteDto } from './dto/update-ticket-note.dto';

@Controller('ticket-notes')
export class TicketNotesController {
  constructor(private readonly ticketNotesService: TicketNotesService) {}

  @Post(':ticketId')
  create( @Param('ticketId',ParseIntPipe) ticketId: number, @Req() req: Request, @Body() createTicketNoteDto: CreateTicketNoteDto) {
    return this.ticketNotesService.create(ticketId, (req as any).user.id, createTicketNoteDto);
  }

  @Get('by-ticket/:ticketId')
  findAll(@Param('ticketId', ParseIntPipe) ticketId: number) {
    return this.ticketNotesService.findAll(ticketId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTicketNoteDto: UpdateTicketNoteDto) {
    return this.ticketNotesService.update(id, updateTicketNoteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ticketNotesService.remove(id);
  }
}
