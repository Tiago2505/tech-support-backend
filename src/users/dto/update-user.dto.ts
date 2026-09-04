import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from '../enums';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsBoolean()
    @IsOptional()
    isActive!: boolean;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

}
