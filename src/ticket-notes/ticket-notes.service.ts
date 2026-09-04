import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketNoteDto } from './dto/create-ticket-note.dto';
import { UpdateTicketNoteDto } from './dto/update-ticket-note.dto';
import { Repository } from 'typeorm';
import { TicketNote } from './entities/ticket-note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketsService } from 'src/tickets/tickets.service';
import { handleError } from 'src/common';
import { AuditService } from 'src/audit/audit.service';
import { CreateAuditDto } from 'src/audit/dto';
import { AuditAction, AuditEntity } from 'src/audit/enums';

@Injectable()
export class TicketNotesService {
  constructor(
    @InjectRepository(TicketNote)
    private readonly ticketNotesRepository: Repository<TicketNote>,

    private readonly ticketService: TicketsService,
    private readonly auditService: AuditService,
  ) {}

  async create(
    ticketId: number,
    userId: number,
    createTicketNoteDto: CreateTicketNoteDto,
  ) {
    try {
      await this.ticketService.findOne(ticketId);

      const ticketNote = this.ticketNotesRepository.create({
        ...createTicketNoteDto,
        createdBy: userId,
        ticketId: ticketId,
      });

      await this.ticketNotesRepository.save(ticketNote);

      return ticketNote;
    } catch (error) {
      handleError(error);
    }
  }

  async findAll(ticketId: number) {
    try {
      await this.ticketService.findOne(ticketId);

      return this.ticketNotesRepository.find({ where: { ticketId: ticketId } });
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const ticketNote = await this.ticketNotesRepository.findOne({
        where: { id },
      });

      if (!ticketNote)
        throw new NotFoundException(`Ticket note with id: ${id} not found`);

      return ticketNote;
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateTicketNoteDto: UpdateTicketNoteDto) {
    try {
      await this.findOne(id);

      await this.ticketNotesRepository.update(id, updateTicketNoteDto);

      const ticketNoteUpdated = await this.findOne(id);

      return ticketNoteUpdated;
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const ticketNote = await this.findOne(id);

      await this.ticketNotesRepository.softDelete(id);

      return ticketNote;
    } catch (error) {
      handleError(error);
    }
  }
}
