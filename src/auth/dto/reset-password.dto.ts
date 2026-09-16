import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { REGEX } from "src/common";


export class ResetPasswordDto{

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @Matches(REGEX.PASSWORD)
    newPassword!: string;
    
    @IsString()
    @IsNotEmpty()
    confirmPassword!: string;

    @IsString()
    @IsNotEmpty()
    passwordResetToken!: string;
}