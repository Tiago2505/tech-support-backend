import { PartialType } from '@nestjs/mapped-types';
import { CreateAgentConversationDto } from './create-agent-conversation.dto';

export class UpdateAgentConversationDto extends PartialType(CreateAgentConversationDto) {


}
