import { IsNotEmpty, IsString } from "class-validator";

export class CreateTicketNoteDto {

    @IsString()
    @IsNotEmpty()
    content!: string;

}
