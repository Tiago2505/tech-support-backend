import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';
import { CreateUserDto } from 'src/users/dto';
import { ChangePasswordDto } from './dto';

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

  
}
