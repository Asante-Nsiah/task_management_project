import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project-entity'; 

@Entity(
    
)
export class KanbanColumn {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    name!: string;

    @ManyToOne(() => Project, project => project.kanbanColumns, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project!: Project;
    tasks: any;
}
