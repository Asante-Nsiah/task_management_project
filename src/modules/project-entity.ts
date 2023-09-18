import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from './user-entity'; 

@Entity()
export class Project {
    [x: string]: any;
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @ManyToOne(() => Users, user => user.projects, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'owner_id' })
    owner!: Users;
    projectUsers: any;
    kanbanColumns: any;
    usersProjects: any;
    usersProject: any;
    project: any;
}
