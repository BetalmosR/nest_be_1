import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/entities/Task.entity';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();

    if (!users.length) throw new NotFoundException('There are no users yet!');
    return users;
  }

  async getPosts(id: string): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['tasks'],
      where: { id },
    });
  }
}
