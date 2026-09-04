import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CreateUserDto, CreateUserResponseDto, UpdateUserDto } from './dto';
import { User } from './entities';
import { BcryptAdapter, handleError } from 'src/common';
import { AuditService } from 'src/audit/audit.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAuditDto } from 'src/audit/dto';
import { AuditAction, AuditEntity } from 'src/audit/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly auditService: AuditService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    try {
      const user = await this.findOne(createUserDto.email);

      if (user)
        throw new ConflictException(
          `User with email: ${user.email} already exists`,
        );

      createUserDto.password = BcryptAdapter.hash(createUserDto.password);

      const newUser = this.userRepository.create(createUserDto);

      await this.userRepository.save(newUser);

      const { password, ...properties } = newUser;

      return properties;
    } catch (error) {
      handleError(error);
    }
  }

  async findAll(): Promise<CreateUserResponseDto[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(term: number | string): Promise<CreateUserResponseDto | null> {
    try {
      let user: User | null;

      if (isNaN(Number(term))) {
        user = await this.userRepository.findOne({
          where: { email: Like(`${term}`) },
        });
      } else {
        user = await this.userRepository.findOne({
          where: { id: Number(term) },
        });
      }
      if (!user) return null;

      const { password, ...properties } = user;

      return properties;
    } catch (error) {
      handleError(error);
    }
  }

  async findOneWithPassword(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user)
        throw new NotFoundException(`User with email: ${email} not found`);

      return user;
    } catch (error) {
      handleError(error);
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    performedById: number,
  ) {
    try {
      const user = await this.findOne(id);

      if (!user) throw new NotFoundException(`User with id: ${id} not found`);

      const { password, email, ...properties } = updateUserDto;

      await this.userRepository.update(id, properties);

      const userUpdated = await this.findOne(id);

      const auditDto: CreateAuditDto = {
        action: AuditAction.UPDATE,
        entity: AuditEntity.USER,
        affectedRecordId: id,
      };

      await this.auditService.create(performedById, auditDto);

      return userUpdated;
    } catch (error) {
      handleError(error);
    }
  }

  async remove(
    id: number,
    performedById: number,
  ): Promise<CreateUserResponseDto> {
    try {
      const user = await this.findOne(id);

      if (!user) throw new NotFoundException(`User with id: ${id} not found`);

      await this.userRepository.softDelete(id);

      const auditDto: CreateAuditDto = {
        action: AuditAction.DELETE,
        entity: AuditEntity.USER,
        affectedRecordId: id,
      };

      await this.auditService.create(performedById, auditDto);

      return user;
    } catch (error) {
      handleError(error);
    }
  }

  async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
    
    try {
      const user = await this.findOneWithPassword(email);
  
      const {password, ...properties} = user;
  
      const {currentPassword} = changePasswordDto;

      const match = BcryptAdapter.compare(currentPassword, password);
  
      if(!match) throw new UnauthorizedException('The password does not match'); 
      
      const isSamePassword = BcryptAdapter.compare(changePasswordDto.newPassword, password);

      if(isSamePassword) throw new BadRequestException('The new password must be different from the current password');
  
  
      changePasswordDto.newPassword = BcryptAdapter.hash(changePasswordDto.newPassword);
  
      await this.userRepository.update(properties.id, {
        password: changePasswordDto.newPassword
      });
  
      return properties;
      
    } catch (error) {
      handleError(error);
    }

  }
}
