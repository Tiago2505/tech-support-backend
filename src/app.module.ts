import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JoiValidationSchema } from './common/config';
import { AuditModule } from './audit/audit.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [

    ConfigModule.forRoot({

      validationSchema: JoiValidationSchema

    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    UsersModule,

    AuthModule,

    AuditModule,

    TicketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
