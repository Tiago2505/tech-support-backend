import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";
import { CategoryTicket, DeviceType, OperatingSystem, PriorityTicket, StatusTicket } from "../enums";
import { Type } from "class-transformer";

export class CreateTicketDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    title!: string;

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    description!: string;

    @IsEnum(StatusTicket)
    @IsOptional()
    status!: StatusTicket;

    @IsEnum(PriorityTicket)
    @IsOptional()
    priority!: PriorityTicket;

    @IsEnum(CategoryTicket)
    @IsOptional()
    categoryTicket!: CategoryTicket;

    @IsNumber()
    @Min(1)
    @IsOptional()
    @Type(()=>Number)
    technicianId!: number;

    @IsEnum(DeviceType)
    @IsOptional()
    deviceType!: DeviceType;

    @IsString()
    @IsOptional()
    deviceBrand!: string;
    
    @IsString()
    @IsOptional()
    deviceModel!: string;

    @IsEnum(OperatingSystem)
    @IsOptional()
    operatingSystem!: OperatingSystem;


}
