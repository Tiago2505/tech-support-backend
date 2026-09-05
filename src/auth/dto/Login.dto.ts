import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { REGEX } from 'src/common/regex';

export class LoginDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  
  @IsString()
  @IsNotEmpty()
  password!: string
}
