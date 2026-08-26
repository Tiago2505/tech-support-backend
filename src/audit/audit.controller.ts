import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  create(
    @Body() createAuditDto: CreateAuditDto,
    @Req() req: Request
  ) {
    return this.auditService.create((req as any).user.id, createAuditDto);
  }

  @Get()
  findAll() {
    return this.auditService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.auditService.findOne(id);
  }
}
