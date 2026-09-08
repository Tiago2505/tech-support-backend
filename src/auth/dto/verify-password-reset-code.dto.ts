import { IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class VerifyPasswordResetCodeDto{
    @IsString()
    @IsNotEmpty()
    @Length(6)
    code!: string;
}