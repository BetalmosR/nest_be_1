import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { Task } from 'src/entities/Task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
