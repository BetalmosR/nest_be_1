import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from 'src/dtos/CreateTask.dto';
import { TaskFilterDto } from 'src/dtos/TaskFilter.dto';
import { Task } from 'src/entities/Task.entity';
import { User } from 'src/entities/User.entity';
import { TaskStatus } from 'src/enums/task-status.enum';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  // async getAllTasks(): Promise<Task[]> {
  //   return this.taskRepository.find({ relations: ['user'] });
  // }

  async getAllTasks(taskFilter: TaskFilterDto, id: string): Promise<Task[]> {
    const { status, search } = taskFilter;
    // const lists: FindManyOptions<Task> = {
    //   where: {
    //     status: status || undefined,
    //     title: search ? Like(`%${search}%`) : undefined,
    //   },
    // };

    // const task = await this.taskRepository.find({ where: { user: { id } } });

    const query = this.taskRepository
      .createQueryBuilder('task')
      .where('task.user = :userId', { userId: id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getTaskById(userId: string, taskId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['user'],
    });
    if (task && task.user && task.user.id === userId) {
      return task;
    }

    throw new NotFoundException();
  }

  async createTask(createTask: CreateTaskDto, id: string): Promise<Task> {
    const { title, description } = createTask;

    const user = await this.userRepository.findOne({
      where: { id },
    });

    const newTask = await this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.taskRepository.save(newTask);
    delete newTask.user;

    return newTask;
  }

  async updateTask(
    userId: string,
    taskId: number,
    taskStatus: TaskStatus,
  ): Promise<Task> {
    const task = await this.getTaskById(userId, taskId);

    task.status = taskStatus;

    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(userId: string, taskId: number): Promise<string> {
    const task = await this.getTaskById(userId, taskId);
    await this.taskRepository.delete(task);

    return `Task with id ${taskId} was deleted!`;
  }

  // private async getTaskById(
  //   userId: string,
  //   taskId: number,
  //   entityManager?: EntityManager
  // ): Promise<Task> {
  //   const options: FindOneOptions<Task> = {
  //     where: { userId, id: taskId } as FindConditions<Task>,
  //   };

  //   if (entityManager) {
  //     return entityManager.findOneOrFail(Task, options);
  //   }

  //   return this.taskRepository.findOneOrFail(options);
  // }

  // async deleteTask(userId: string, taskId: number): Promise<string> {
  //   return this.taskRepository.manager.transaction(async (entityManager) => {
  //     const task = await this.getTaskById(userId, taskId, entityManager);
  //     await entityManager.remove(task);

  //     return `Task with id ${taskId} was deleted!`;
  //   });
  // }
}
