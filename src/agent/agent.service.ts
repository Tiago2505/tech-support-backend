import { Injectable } from '@nestjs/common';
import { OpenaiService } from 'src/openai/openai.service';
import { tools } from './tools/agent.tool';
import { TicketsService } from 'src/tickets/tickets.service';
import { DeviceType, OperatingSystem } from 'src/tickets/enums';
import { Repository } from 'typeorm';
import { AgentConversation } from './entities/agent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAgentConversationDto, UpdateAgentConversationDto } from './dtos';
import { TicketNotesService } from 'src/ticket-notes/ticket-notes.service';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(AgentConversation)
    private readonly agentRepository: Repository<AgentConversation>,

    private readonly openaiService: OpenaiService,
    private readonly ticketService: TicketsService,
    private readonly ticketNotesService: TicketNotesService
  ) {}

  private async create(createAgentConversationDto: CreateAgentConversationDto) {
    const agentConversation = this.agentRepository.create(
      createAgentConversationDto,
    );

    await this.agentRepository.save(agentConversation);
  }

  private async findOneByUserId(userId: number) {
    return this.agentRepository.findOne({ where: { userId: userId } });
  }

  private async update(
    id: number,
    updateAgentConversationDto: UpdateAgentConversationDto,
  ) {
    return this.agentRepository.update(id, updateAgentConversationDto);
  }

  async chat(message: string, userId: number) {
    const agentConversation = await this.findOneByUserId(userId);

    const response = await this.openaiService.getAgentResponse(
      message,
      tools,
      agentConversation?.responseId,
    );

    let agentConversationDto: CreateAgentConversationDto = {
      userId: userId,
      responseId: response.id,
    };

    for (const item of response.output) {
      if (item.type === 'function_call') {
        if (item.name === 'createTicket') {
          const args = JSON.parse(item.arguments);

          if (!args.deviceType) {
            args.deviceType = DeviceType.OTHER;
          }

          if (!args.operatingSystem) {
            args.operatingSystem = OperatingSystem.OTHER;
          }

          const ticket = await this.ticketService.create(args, [], userId);

          const finalResponse = await this.openaiService.getAgentFinalResponse(
            response.id,
            {
              type: 'function_call_output',
              call_id: item.call_id,
              output: JSON.stringify(ticket),
            },
          );

          agentConversationDto.responseId = finalResponse.id;

          return finalResponse.output_text;
        } else if (item.name === 'getTicket') {
          const args = JSON.parse(item.arguments);
          const ticket = await this.ticketService.findOne(args.id);
          const ticketNotes = await this.ticketNotesService.findAll(ticket.id);


          const ticketInfo = {
            id: ticket.id,
            title: ticket.title,
            status: ticket.status,
            priority: ticket.priority,
            categoryTicket: ticket.categoryTicket,
            notes: ticketNotes.map(note => note.content)
          };

          const finalResponse = await this.openaiService.getAgentFinalResponse(
            response.id,
            {
              type: 'function_call_output',
              call_id: item.call_id,
              output: JSON.stringify(ticketInfo),
            },
          );

          return finalResponse.output_text;
        }
      }
    }

    if (!agentConversation) {
      await this.create(agentConversationDto);
    } else {
      const updateAgentConversationDto: UpdateAgentConversationDto = {
        responseId: agentConversationDto.responseId,
      };

      await this.update(agentConversation.id, updateAgentConversationDto);
    }

    return response.output_text;
  }
}
