import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateNewUserDto } from './dto/createNewUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post('register')
  async createNewUser(@Body() userDataDto: CreateNewUserDto) {
    const user = await this.usersService.createUser(userDataDto);
    return { ...user };
  }
}
