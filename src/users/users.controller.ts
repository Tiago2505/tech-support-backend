import { Controller, Get, Body, Patch, Param, Delete, ParseIntPipe, Req } from '@nestjs/common';
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
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return this.usersService.update(id, updateUserDto, (req as any).user.id  );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.usersService.remove(id, (req as any).user.id );
  }
}
