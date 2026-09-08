import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ChangePasswordDto, LoginDto } from './dto';
import { CreateUserDto } from 'src/users/dto';
import { ConfigService } from '@nestjs/config';
import { BcryptAdapter, handleError, JwtAdapter } from 'src/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);

      const seed = this.configService.get<string>('SEED');

      const payload = {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      };

      const token = await JwtAdapter.generateToken(seed!, payload);
      return {
        user,
        token,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      const user = await this.usersService.findOne(email);

      if (!user)
        throw new NotFoundException(`User with email ${email} not found`);

      const userDB = await this.usersService.findOneWithPassword(email);

      if (!BcryptAdapter.compare(password, userDB!.password)) {
        throw new UnauthorizedException('The password does not match');
      }

      const seed = this.configService.get<string>('SEED');

      const payload = {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      };

      const token = await JwtAdapter.generateToken(seed!, payload);

      return {
        user,
        token,
      };
    } catch (error) {
      handleError(error);
    }
  }

   async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
    
    try {
      const user = await this.usersService.findOneWithPassword(email);
  
      const {password, ...properties} = user;
  
      const {currentPassword, newPassword, confirmPassword} = changePasswordDto;

      if(newPassword !== confirmPassword) throw new BadRequestException('New password and confirmation do not match');

      const match = BcryptAdapter.compare(currentPassword, password);
  
      if(!match) throw new UnauthorizedException('Current password is incorrect'); 
      
      const isSamePassword = BcryptAdapter.compare(changePasswordDto.newPassword, password);

      if(isSamePassword) throw new BadRequestException('The new password must be different from the current password');
  
  
      changePasswordDto.newPassword = BcryptAdapter.hash(changePasswordDto.newPassword);
  
      await this.usersService.updatePassword(properties.id, changePasswordDto.newPassword);
  
      return properties;
      
    } catch (error) {
      handleError(error);
    }

  }
}
