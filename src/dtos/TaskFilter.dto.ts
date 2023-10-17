import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from 'src/enums/task-status.enum';

export class TaskFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.DONE, TaskStatus.INPROGRESS, TaskStatus.OPEN])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
