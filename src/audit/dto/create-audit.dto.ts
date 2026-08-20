import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import {Type} from 'class-transformer';

enum Action {
    DELETE = 'DELETE',
    UPDATE = 'UPDATE'
}

enum Entity{
    USER = 'User',
    TICKET = 'Ticket'
}

export class CreateAuditDto {

    @IsString()
    @IsEnum(Action)
    @IsNotEmpty()
    action!: Action;

    @IsString()
    @IsNotEmpty()
    @IsEnum(Entity)
    entity!: Entity;

    @Type(()=>Number)
    @IsNumber()
    @IsNotEmpty()
    affectedUserId!: number;

}
