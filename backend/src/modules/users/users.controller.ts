import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ======================
  // CREATE USER
  // ======================
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // ======================
  // GET ALL USERS
  // ======================
  @Get()
  findAll(
    @Query() query: any,
    @Query('current', new DefaultValuePipe(1), ParseIntPipe)
    current: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe)
    pageSize: number,
  ) {
    return this.usersService.findAll(query, current, pageSize);
  }

  // ======================
  // GET USER BY ID
  // ======================
  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid user id');
    }

    return this.usersService.findById(id);
  }

  // ======================
  // UPDATE USER
  // ======================
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid user id');
    }

    return this.usersService.update({
      ...updateUserDto,
      _id: id,
    });
  }

  // ======================
  // DELETE USER (SOFT DELETE)
  // ======================
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid user id');
    }

    return this.usersService.remove(id);
  }
}
