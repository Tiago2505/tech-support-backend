import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";



export class CreateAgentConversationDto{

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    userId!: number;

    @IsString()
    @IsNotEmpty()
    responseId!: string;

}