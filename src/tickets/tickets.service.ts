import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloseTicketDto, CreateTicketDto } from './dto';
import { ILike, Repository } from 'typeorm';
import { Ticket } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { handleError } from 'src/common';
import { AuditService } from 'src/audit/audit.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateTicketParams } from './interfaces';
import { UsersService } from 'src/users/users.service';
import { OpenaiService } from 'src/openai/openai.service';
import { CreateAuditDto } from 'src/audit/dto';
import { AuditAction, AuditEntity } from 'src/audit/enums';
import { StatusTicket } from './enums';
import { TicketDiagnosisResponse } from 'src/openai/dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    private readonly auditService: AuditService,

    private readonly cloudinaryService: CloudinaryService,

    private readonly userService: UsersService,

    private readonly openaiService: OpenaiService,
  ) {}

  private async getDiagnosis(
    createTicketDto: CreateTicketDto,
  ): Promise<TicketDiagnosisResponse> {
    const {
      deviceBrand,
      deviceType,
      deviceModel,
      operatingSystem,
      description,
    } = createTicketDto;

    const prompt = `
    Analiza el siguiente problema técnico:

    Tipo de dispositivo: ${deviceType}
    Marca: ${deviceBrand ?? 'No especificada'}
    Modelo: ${deviceModel ?? 'No especificado'}
    Sistema operativo: ${operatingSystem ?? 'No especificado'}
    Descripción del problema: ${description}
  `;

    const response = await this.openaiService.getTechnicalDiagnosis(prompt);

    console.log('DIAGNOSTIC JSON:', response);

    return JSON.parse(response);
  }

  async create(
    createTicketDto: CreateTicketDto,
    images: Express.Multer.File[],
    createdBy: number,
  ) {
    try {
      const { technicianId, description } = createTicketDto;

      if (technicianId) {
        const user = await this.userService.findOne(technicianId);

        if (!user)
          throw new NotFoundException(
            `user with id: ${technicianId} not found`,
          );

        if (user!.role !== 'TECHNICIAN')
          throw new BadRequestException(
            `User with id: ${technicianId} is not a technician`,
          );
      }

      let diagnosis: TicketDiagnosisResponse | null = null;

      if (description) {
        diagnosis = await this.getDiagnosis(createTicketDto);
      }

      if (!images) {
        images = [];
      }

      const uploadedImages = await this.cloudinaryService.uploadImages(images);

      const ticket = this.ticketRepository.create({
        ...createTicketDto,
        createdBy,
        evidence: uploadedImages,
        aiDiagnosis: diagnosis,
      });

      await this.ticketRepository.save(ticket);

      return ticket;
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      return await this.ticketRepository.find({
        relations: {
          user: true,
        },
      });
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
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

  async update(updateTicketParams: UpdateTicketParams) {
    try {
      const { id, updateTicketDto, updatedBy, newImages } = updateTicketParams;

      await this.findOne(id);

      const {
        technicianId,
        currentImages,
        deletedCurrentImages,
        description,
        ...properties
      } = updateTicketDto;

      if (technicianId !== undefined) {
        const user = await this.userService.findOne(technicianId);

        if (!user) {
          throw new NotFoundException(
            `user with id: ${technicianId} not found`,
          );
        }

        if (user.role !== 'TECHNICIAN') {
          throw new BadRequestException(
            `User with id: ${technicianId} is not a technician`,
          );
        }
      }

      if (deletedCurrentImages?.length) {
        await this.cloudinaryService.deleteImages(deletedCurrentImages);
      }

      const updateData: Partial<Ticket> = {
        ...properties,
      };

      if (technicianId !== undefined) {
        updateData.technicianId = technicianId;
      }

      if (description !== undefined) {
        updateData.description = description;

        updateData.aiDiagnosis = JSON.parse(
          await this.openaiService.getTechnicalDiagnosis(description),
        );
      }

      if (currentImages !== undefined || newImages?.length) {
        let images = currentImages ?? [];

        if (newImages?.length) {
          const newImagesUploaded =
            await this.cloudinaryService.uploadImages(newImages);

          images = [...images, ...newImagesUploaded];
        }

        updateData.evidence = images;
      }

      await this.ticketRepository.update(id, updateData);

      const ticketUpdated = await this.findOne(id);

      const auditDto: CreateAuditDto = {
        action: AuditAction.UPDATE,
        entity: AuditEntity.TICKET,
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
        action: AuditAction.DELETE,
        entity: AuditEntity.TICKET,
        affectedRecordId: id,
      };

      await this.auditService.create(deletedBy, auditDto);

      return ticket;
    } catch (error) {
      handleError(error);
    }
  }

  async close(id: number, closeTicketDto: CloseTicketDto) {
    try {
      const ticket = await this.findOne(id);

      if (ticket!.closedAt)
        throw new ConflictException(`Ticket with id: ${id} is already closed`);

      await this.ticketRepository.update(id, {
        closedAt: new Date(),
        resolution: closeTicketDto.resolution,
        status: StatusTicket.CLOSED,
      });

      const ticketClosed = await this.findOne(id);

      return ticketClosed;
    } catch (error) {
      handleError(error);
    }
  }

  async reopen(id: number) {
    try {
      const ticket = await this.findOne(id);

      if (!ticket!.closedAt)
        throw new ConflictException(`Ticket with id: ${id} is not closed`);

      await this.ticketRepository.update(id, {
        closedAt: null,
        resolution: null,
        status: StatusTicket.OPEN,
      });

      const tickedReopen = await this.findOne(id);

      return tickedReopen;
    } catch (error) {
      handleError(error);
    }
  }

  async findByUser(userId: number) {
    try {
      const userExists = await this.userService.findOne(userId);

      if (!userExists)
        throw new NotFoundException(`user with id: ${userId} not found`);

      const userTickets = await this.ticketRepository.find({
        where: {
          createdBy: userId,
        },
        relations: {
          technician: true,
        },
      });

      return userTickets;
    } catch (error) {
      handleError(error);
    }
  }

  async findWithRelations(id: number) {
    try {
      await this.findOne(id);

      const ticket = await this.ticketRepository.findOne({
        where: { id },
        relations: {
          technician: true,
        },
      });

      return ticket;
    } catch (error) {
      handleError(error);
    }
  }

  async claim(technicianId: number, ticketId: number) {
    try {
      const userExists = await this.userService.findOne(technicianId);

      if (!userExists)
        throw new NotFoundException(`User with id: ${technicianId} not found`);

      if (userExists.role !== 'TECHNICIAN')
        throw new ForbiddenException('Only technicians can claim tickets');

      await this.findOne(ticketId);

      await this.ticketRepository.update(ticketId, {
        technicianId,
        status: StatusTicket.IN_PROGRESS,
      });

      const ticketUpdated = await this.findOne(ticketId);

      return ticketUpdated;
    } catch (error) {
      handleError(error);
    }
  }
}
