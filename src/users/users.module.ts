import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities';


@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  exports: [UsersService]
})
export class UsersModule {}
