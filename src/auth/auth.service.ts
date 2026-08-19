import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto';
import { BcryptAdapter } from 'src/common/config';
import { CreateUserDto } from 'src/users/dto';

@Injectable()
export class AuthService {

  constructor(

    private readonly usersService: UsersService

  ){}

  async create(createUserDto: CreateUserDto) {

    return await this.usersService.create(createUserDto)

  }

  async login(loginDto: LoginDto){

    const {email, password} = loginDto;
    
    const user = await this.usersService.findOne(email);

    if(!user) throw new NotFoundException(`User with email ${email} not found`);

    const userDB = await this.usersService.findOneWithPassword(email); 

    if(!BcryptAdapter.compare(password, userDB!.password)){
      throw new UnauthorizedException('The password does not match'); 
    }

    return {
      user,
    }

  }
}
