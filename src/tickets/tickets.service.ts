import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto, ImageDto } from './dto';
import { ILike, Repository } from 'typeorm';
import { Ticket } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { handleError } from 'src/common';
import { AuditService } from 'src/audit/audit.service';
import { Action, CreateAuditDto, Entity } from 'src/audit/dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateTicketParams } from './interfaces';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    private readonly auditService: AuditService,

    private readonly cloudinaryService: CloudinaryService,

    private readonly userService: UsersService,
  ) {}

  async create(createTicketDto: CreateTicketDto, images: Express.Multer.File[], createdBy: number) {
    try {

      const {technicianId} = createTicketDto;

      if(technicianId) {
        const user = await this.userService.findOne(technicianId);

        if(!user) throw new NotFoundException(`user with id: ${technicianId} not found`);

        if(user!.role !== 'TECHNICIAN') throw new BadRequestException(`User with id: ${technicianId} is not a technician`);

      }
      const uploadedImages = await this.cloudinaryService.uploadImages(images);

      const ticket = this.ticketRepository.create({
        ...createTicketDto,
        createdBy,
        evidence: uploadedImages
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

  async findOne(id: number){
    try {
       const ticket = await this.ticketRepository.findOne({
          where: { id: id },
        });

        if (!ticket) {
          throw new NotFoundException(`Ticket with id: ${id} not found`);
        }

        return ticket;
    } catch (error) {
      handleError(error);
    }
  }

  async findByTerm(term: string | number) {
    try {
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
    updateTicketParams: UpdateTicketParams
  ) {
    try {

      const {id, updateTicketDto, updatedBy, newImages} = updateTicketParams;

      const {technicianId} = updateTicketDto;

      if(technicianId) {
        const user = await this.userService.findOne(technicianId);

        if(!user) throw new NotFoundException(`user with id: ${technicianId} not found`);

        if(user!.role !== 'TECHNICIAN') throw new BadRequestException(`User with id: ${technicianId} is not a technician`);

      }

      await this.findOne(id);

      const {currentImages, deletedCurrentImages, ...properties} = updateTicketDto;

      if( deletedCurrentImages && deletedCurrentImages.length > 0) await this.cloudinaryService.deleteImages(deletedCurrentImages);
      
      let images: ImageDto[] = currentImages ? currentImages : [];

      if(newImages && newImages.length > 0){
        const newImagesUploaded = await this.cloudinaryService.uploadImages(newImages);
      
        images.push(...newImagesUploaded);
      }

      await this.ticketRepository.update(id, {
        ...properties,
        evidence: images,
      });

      const ticketUpdated = await this.findOne(id);

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
      const ticket = await this.findOne(id);

      await this.ticketRepository.softDelete(id);

      const auditDto: CreateAuditDto = {
        action: Action.DELETE,
        entity: Entity.TICKET,
        affectedRecordId: id,
      };

      await this.auditService.create(deletedBy, auditDto);

      return ticket;
    } catch (error) {
      handleError(error);
    }
  }

  async resolve(id: number) {
    try {
      const ticket = await this.findOne(id);

      if(ticket!.resolvedAt) throw new ConflictException(`Ticket with id: ${id} is already resolved`);

      await this.ticketRepository.update(id, {
        resolvedAt: new Date(),
      });

      const ticketResolved = await this.findOne(id);

      return ticketResolved;
    } catch (error) {
      handleError(error);
    }
  }

  async close(id: number) {
    try {
      const ticket = await this.findOne(id);

      if(ticket!.closedAt) throw new ConflictException(`Ticket with id: ${id} is already closed`);

      await this.ticketRepository.update(id, {
        closedAt: new Date(),
      });

      const ticketClosed = await this.findOne(id);

      return ticketClosed;
    } catch (error) {
      handleError(error);
    }
  }
}
