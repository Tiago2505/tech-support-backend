import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyPasswordResetCodeDto{
    @IsString()
    @IsNotEmpty()
    @Length(6)
    code!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;
}