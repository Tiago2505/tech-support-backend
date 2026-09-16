import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketNoteDto } from './create-ticket-note.dto';

export class UpdateTicketNoteDto extends PartialType(CreateTicketNoteDto) {}
