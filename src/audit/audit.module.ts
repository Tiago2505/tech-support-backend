import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities';
import { AuditController } from './audit.controller';
import { AuthMiddleware } from 'src/common/middlewares';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [AuditService],
  imports: [TypeOrmModule.forFeature([AuditLog]), forwardRef(() => UsersModule),],
  exports: [AuditService],
  controllers: [AuditController]
})
export class AuditModule {

  configure(consumer: MiddlewareConsumer){
    consumer.apply(AuthMiddleware).forRoutes('audit');
  }

}
