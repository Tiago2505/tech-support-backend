import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsArray, IsOptional } from 'class-validator';
import { ImageDto } from 'src/cloudinary/dtos';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {


    @IsArray()
    @IsOptional()
    currentImages!: ImageDto[];

    @IsArray()
    @IsOptional()
    deletedCurrentImages!: ImageDto[];



}
