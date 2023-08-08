import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user-entity'; 
import { Project } from './project-entity'; 

@Entity(
)
export class UsersProject {
    @PrimaryColumn()
    usersId!: number;

    @PrimaryColumn()
    projectId!: number;

    @ManyToOne(() => User, user => user.userProjects, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'users_id' })
    user!: User;

    @ManyToOne(() => Project, project => project.usersProject, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project!: Project;
}
