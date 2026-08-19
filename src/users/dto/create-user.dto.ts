import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { REGEX } from 'src/common/regex';

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    fullname!: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @Matches(REGEX.PASSWORD)
    password!: string;

    @IsString()
    @IsNotEmpty()
    @Matches(REGEX.PHONE)
    phone!: string;

    
    
    

}
