import { EntityRepository, Repository } from 'typeorm';
import { Project } from '../modules/project-entity'; 

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  async createProject(newProject: Partial<Project>): Promise<Project> {
    try {
      const project = this.create(newProject);
      return await this.save(project);
    } catch (error) {
      throw error;
    }
  }

  async findProjectById(projectId: number): Promise<Project | null> {
    try {
      const project = await this.findOne({ where: { id: projectId } });
      return project || null;
    } catch (error) {
      throw error;
    }
  }

  async findProjectByName(projectName: string): Promise<Project | null> {
    try {
      const project = await this.findOne({ where: { name: projectName } });
      return project || null;
    } catch (error) {
      throw error;
    }
  }
}
