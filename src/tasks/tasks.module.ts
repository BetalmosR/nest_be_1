import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/entities/Task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/entities/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
