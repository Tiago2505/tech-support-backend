import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import {Type} from 'class-transformer';

export enum Action {
    DELETE = 'DELETE',
    UPDATE = 'UPDATE'
}

export enum Entity{
    USER = 'USER',
    TICKET = 'TICKET'
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
    affectedRecordId!: number;

}
