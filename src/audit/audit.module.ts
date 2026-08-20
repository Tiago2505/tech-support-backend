import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities';

@Module({
  controllers: [AuditController],
  providers: [AuditService],
  imports: [TypeOrmModule.forFeature([AuditLog])]
})
export class AuditModule {}
