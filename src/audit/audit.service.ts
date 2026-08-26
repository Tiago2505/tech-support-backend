import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuditLog } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAuditDto } from './dto';
import { handleError } from 'src/common';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async create(id: number, createAuditDto: CreateAuditDto): Promise<AuditLog> {

    try {

      const ticket = this.auditRepository.create({
        performedById: id,
        ...createAuditDto
      });

      return await this.auditRepository.save(ticket);

    } catch (error) {
      handleError(error);
    }
  }

  async findAll(): Promise<AuditLog[]> {
    try {
      return await this.auditRepository.find();
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number): Promise<AuditLog> {

    try {
      
      const ticket = await this.auditRepository.findOne({where: {id}});
  
      if(!ticket) throw new NotFoundException(`Ticket with id: ${id} not found`);
  
      return ticket;
    } catch (error) {
      handleError(error);
    }


  }
}
