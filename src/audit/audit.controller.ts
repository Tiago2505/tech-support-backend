import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AdminRoleGuard } from 'src/common/guards';

@UseGuards(AdminRoleGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll() {
    return this.auditService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) auditId: number){
    return this.auditService.findOne(auditId)
  }
}
