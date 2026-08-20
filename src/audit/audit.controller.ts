import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post(':id')
  create(
    @Param('id', ParseIntPipe) id: number,
    @Body() createAuditDto: CreateAuditDto,
  ) {
    return this.auditService.create(id, createAuditDto);
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
