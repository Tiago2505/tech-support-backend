import { IsNotEmpty, IsString, Matches } from "class-validator";
import { REGEX } from "src/common";

export class ChangePasswordByAdminDto {
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX.PASSWORD)
  newPassword!: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword!: string;
}
