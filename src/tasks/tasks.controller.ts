import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from 'src/dtos/CreateTask.dto';
import { Task } from 'src/entities/Task.entity';
import { TaskStatus } from 'src/enums/task-status.enum';
import { TaskStatusValidationPipe } from './pipes/task-validation.pipe';
import { TaskFilterDto } from 'src/dtos/TaskFilter.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entities/User.entity';

@Controller(':userId/tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  getTasks(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query(ValidationPipe) taskFilter: TaskFilterDto,
  ): Promise<Task[]> {
    // if (Object.keys(taskFilter).length) {
    //   return this.taskService.getFilteredTask(taskFilter);
    // } else {
    return this.taskService.getAllTasks(taskFilter, userId);
    // }
  }

  @Get(':taskId')
  getTaskById(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<Task> {
    return this.taskService.getTaskById(userId, taskId);
  }

  @Post()
  createTask(
    @Param('userId', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) createDto: CreateTaskDto,
  ): Promise<Task> {
    return this.taskService.createTask(createDto, id);
  }

  @Patch(':taskId')
  updateTask(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body('status', TaskStatusValidationPipe) taskStatus: TaskStatus,
  ): Promise<Task> {
    return this.taskService.updateTask(userId, taskId, taskStatus);
  }

  @Delete(':taskId')
  deleteTask(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<string> {
    return this.taskService.deleteTask(userId, taskId);
  }
}
