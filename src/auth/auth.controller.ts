import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';
import { CreateUserDto } from 'src/users/dto';

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

  
}
