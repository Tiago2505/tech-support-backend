import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.usersService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
