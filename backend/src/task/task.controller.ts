import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { CompleteTaskItemDto } from './dto/complete-task-item.dto';
import { ReportIssueDto } from './dto/report-issue.dto';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  createTask(@Body() dto: CreateTaskDto) {
    return this.taskService.createTask(dto);
  }

  @Get()
  getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.taskService.getTask(id);
  }

  @Post(':id/start')
  startTask(@Param('id') id: string) {
    return this.taskService.startTask(id);
  }

  @Post(':id/assign')
  assignTask(@Param('id') id: string, @Body() dto: AssignTaskDto) {
    return this.taskService.assignTask(id, dto);
  }

  @Post('items/:id/complete')
  completeTaskItem(@Param('id') id: string, @Body() dto: CompleteTaskItemDto) {
    return this.taskService.completeTaskItem(id, dto);
  }

  @Post('items/:id/issue')
  reportIssue(@Param('id') id: string, @Body() dto: ReportIssueDto) {
    return this.taskService.reportIssue(id, dto);
  }
  @Post(':id/complete')
completeTask(@Param('id') id: string) {
  return this.taskService.completeAllItems(id);
}

}
