import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  // LLM: Retrieves all tasks, ordered by creation date.
  findAll(): Promise<Task[]> {
    return this.tasksRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // LLM: Finds a task by ID or throws a not-found error.
  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }
  
  // LLM: Creates and saves a new task.
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(createTaskDto);
    return this.tasksRepository.save(task);
  }
  
  // LLM: Updates an existing task and returns the updated task
  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  // LLM: Deletes a task by ID or throws a not-found error.
  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }
}