import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/Login.dto';

import { CreateUserDto } from 'src/users/dto';

import {
  ChangePasswordDto,
  ChangePasswordByAdminDto,
  RequestPasswordReset,
  ResetPasswordDto,
  VerifyPasswordResetCodeDto,
} from './dto';

import { AdminRoleGuard } from 'src/common/guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ) {
    return this.authService.changePassword(
      (req as any).user.email,
      changePasswordDto,
    );
  }

  @Post('forgot-password')
  requestPasswordReset(@Body() requestPasswordReset: RequestPasswordReset) {
    return this.authService.requestPasswordReset(requestPasswordReset);
  }

  @Post('verify-code')
  verifyPasswordResetCode(
    @Body()
    verifyPasswordResetCodeDto: VerifyPasswordResetCodeDto,
  ) {
    return this.authService.verifyPasswordResetCode(verifyPasswordResetCodeDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(AdminRoleGuard)
  @Post(':id/change-password')
  changePasswordByAdmin(
    @Param('id', ParseIntPipe) userId: number,
    @Body()
    changePasswordDto: ChangePasswordByAdminDto,
  ) {
    return this.authService.changePasswordByAdmin(
      userId,
      changePasswordDto,
    );
  }
}
