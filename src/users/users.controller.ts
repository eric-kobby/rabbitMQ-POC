import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  Controller,
  Body,
  ValidationPipe,
  Param,
  ParseIntPipe,
  Post,
  Get,
  Delete,
} from '@nestjs/common';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get(':userId/avatar')
  async getAvatar(@Param('userId', ParseIntPipe) userId: number) {
    return await this.usersService.getUserAvatar(userId);
  }
  @Get(':userId')
  async findOne(@Param('userId', ParseIntPipe) userId: number) {
    return await this.usersService.findOne(userId);
  }

  @Delete(':userId/avatar')
  async remove(@Param('userId', ParseIntPipe) userId: number) {
    return await this.usersService.removeAvatar(userId);
  }
}
