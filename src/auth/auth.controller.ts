import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';
import { CreateUserDto } from 'src/users/dto';
import { ChangePasswordDto, ResetPasswordDto, VerifyPasswordResetCodeDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto){
    return this.authService.login(loginDto);
  }

  @Post('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req: Request){
    return this.authService.changePassword((req as any).user.email, changePasswordDto);
  }

  @Post('forgot-password')
  requestPasswordReset(@Req() req: Request){
    return this.authService.requestPasswordReset((req as any).user.id, (req as any).user.email);
  }

  @Post('verify-code')
  verifyPasswordResetCode(@Req() req: Request, @Body() verifyPasswordResetCodeDto: VerifyPasswordResetCodeDto){
    return this.authService.verifyPasswordResetCode((req as any).user.id, verifyPasswordResetCodeDto);
  }

  @Post('reset-password')
  resetPassword(@Req() req: Request, @Body() resetPasswordDto: ResetPasswordDto){
    return this.authService.resetPassword((req as any).user.email,  resetPasswordDto);
  }

  
}
