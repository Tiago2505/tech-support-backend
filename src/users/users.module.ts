import {
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities';
import { AuditModule } from 'src/audit/audit.module';
import { AuthMiddleware } from 'src/common/middlewares';

@Module({
  controllers: [UsersController],

  providers: [
    UsersService,
  ],

  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    AuditModule,
  ],

  exports: [
    UsersService,
  ],
})
export class UsersModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('users');
  }
}