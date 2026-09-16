import { IsNotEmpty, IsString, Matches } from "class-validator";
import { REGEX } from "src/common";



export class ChangePasswordDto{

    @IsString()
    @IsNotEmpty()
    currentPassword!: string;

    @IsString()
    @IsNotEmpty()
    @Matches(REGEX.PASSWORD)
    newPassword!: string;

    @IsString()
    @IsNotEmpty()
    confirmPassword!: string;


}