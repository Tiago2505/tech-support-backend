import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto, UpdateTicketDto } from './dto';
import { ILike, Repository } from 'typeorm';
import { Ticket } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { handleError } from 'src/common';
import { AuditService } from 'src/audit/audit.service';
import { Action, CreateAuditDto, Entity } from 'src/audit/dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    private readonly auditService: AuditService,
  ) {}

  async create(createTicketDto: CreateTicketDto, createdBy: number) {
    try {
      const ticket = this.ticketRepository.create({
        ...createTicketDto,
        createdBy,
      });

      await this.ticketRepository.save(ticket);

      return ticket;
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      return await this.ticketRepository.find();
    } catch (error) {
      handleError(error);
    }
  }

  async findByTerm(term: string | number) {
    try {
      if (typeof term === 'number') {
        const ticket = await this.ticketRepository.findOne({
          where: { id: term },
        });

        if (!ticket) {
          throw new NotFoundException(`Ticket not found`);
        }

        return ticket;
      }

      const tickets = await this.ticketRepository.find({
        where: [
          { title: ILike(`%${term}%`) },
          { description: ILike(`%${term}%`) },
          { deviceBrand: ILike(`%${term}%`) },
          { deviceModel: ILike(`%${term}%`) },
        ],
      });

      if (tickets.length === 0) {
        throw new NotFoundException(`Ticket not found`);
      }

      return tickets;
    } catch (error) {
      handleError(error);
    }
  }

  async update(
    id: number,
    updateTicketDto: UpdateTicketDto,
    updatedBy: number,
  ) {
    try {
      await this.findByTerm(id);

      await this.ticketRepository.update(id, updateTicketDto);

      const ticketUpdated = await this.findByTerm(id);

      const auditDto: CreateAuditDto = {
        action: Action.UPDATE,
        entity: Entity.TICKET,
        affectedRecordId: id,
      };

      await this.auditService.create(updatedBy, auditDto);

      return ticketUpdated;
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number, deletedBy: number) {
    try {
      const ticket = await this.findByTerm(id);

      await this.ticketRepository.softDelete(id);

      const auditDto: CreateAuditDto = {
        action: Action.DELETE,
        entity: Entity.TICKET,
        affectedRecordId: id,
      };

      await this.auditService.create(deletedBy, auditDto);

      return ticket;
    } catch (error) {
      handleError(error)
    }
  }

  async resolve(id: number) {
    try {
      await this.findByTerm(id);

      const ticket = await this.ticketRepository.update(id, {
        resolvedAt: new Date(),
      });

      return ticket;
    } catch (error) {
      handleError(error);
    }
  }

  async close(id: number) {
    try {
      await this.findByTerm(id);

      const ticket = await this.ticketRepository.update(id, {
        closedAt: new Date(),
      });

      return ticket;
    } catch (error) {
      handleError(error);
    }
  }
}
