import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  Post,
  UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AdminRoleGuard } from 'src/common/guards';

@Controller('users')
@UseGuards(AdminRoleGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    const value = isNaN(Number(term)) ? term : Number(term);

    return this.usersService.findOne(value);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    return this.usersService.update(id, updateUserDto, (req as any).user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.usersService.remove(id, (req as any).user.id);
  }

}
