import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import {Type} from 'class-transformer';
import { AuditAction, AuditEntity } from "../enums";



export class CreateAuditDto {

    @IsString()
    @IsEnum(AuditAction)
    @IsNotEmpty()
    action!: AuditAction;

    @IsString()
    @IsNotEmpty()
    @IsEnum(AuditEntity)
    entity!: AuditEntity;

    @Type(()=>Number)
    @IsNumber()
    @IsNotEmpty()
    affectedRecordId!: number;

}
