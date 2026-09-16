import { IsNotEmpty, IsString } from "class-validator";


export class CloseTicketDto{

    @IsNotEmpty()
    @IsString()
    resolution!: string;

}