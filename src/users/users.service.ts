import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { handleError } from '../common/helpers';
import { BcryptAdapter } from 'src/common/config';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
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
      console.error(error);
      handleError(error);
    }
  }

  async findAll() {
    try {
      return await this.userRepository.find();
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(term: number | string) {
    try {
      let user: User | null;

      if (isNaN(+term)) {
        user = await this.userRepository.findOne({
          where: { email: ILike(`${term}`) },
        });
      } else {
        user = await this.userRepository.findOne({
          where: { id: +term },
        });
      }
      if (!user || user.deletedAt !== null) return null;

      const { password, ...properties } = user;

      return properties;
    } catch (error) {
      handleError(error);
    }
  }

  async findOneWithPassword(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if(!user) throw new NotFoundException(`User with email: ${email} not found`);

      return user;
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);

      if (!user) throw new NotFoundException(`User with id: ${id} not found`);

      const { password, ...properties } = updateUserDto;

      await this.userRepository.update(id, properties);

      return properties;
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.findOne(id);

      if (!user) throw new NotFoundException(`User with id: ${id} not found`);

      await this.userRepository.softDelete(id);

      return user;
    } catch (error) {
      handleError(error);
    }
  }
}
