import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsArray, IsOptional } from 'class-validator';
import { ImageDto } from 'src/cloudinary/dtos';
import { Transform } from 'class-transformer';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }

    return value;
  })
  currentImages!: ImageDto[];

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }

    return value;
  })
  deletedCurrentImages!: ImageDto[];
}
