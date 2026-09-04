import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AgentService } from './agent.service';
import { ChatDto } from './dtos';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  chat(@Body() chatDto: ChatDto, @Req() req: Request) {
    return this.agentService.chat(chatDto.message, (req as any).user.id);
  }

}
