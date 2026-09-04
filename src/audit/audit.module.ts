import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities';

@Module({
  providers: [AuditService],
  imports: [TypeOrmModule.forFeature([AuditLog])],
  exports: [AuditService]
})
export class AuditModule {

}
