import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/User.entity';
import { Task } from 'src/entities/Task.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getPosts(@Param('id', ParseUUIDPipe) id: string): Promise<User[]> {
    return this.usersService.getPosts(id);
  }
}
