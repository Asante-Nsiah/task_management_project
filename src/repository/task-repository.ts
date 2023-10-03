import { EntityRepository, Repository, Like } from 'typeorm';
import { Task } from '../modules/task-entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(title: string, description: string, deadline: Date): Promise<Task> {
    const task = new Task();
    task.title = title;
    task.description = description;
    task.deadline = deadline;


    return await this.save(task);
  }

  async findTasksByTitleOrDescription(keyword: string): Promise<Task[]> {
    return await this.find({
      where: [
        { title: Like(`%${keyword}%`) },
        { description: Like(`%${keyword}%`) },
      ],
    });
  }
}
