import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user-entity'; 

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @ManyToOne(() => User, user => user.projects, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'owner_id' })
    owner!: User;
    projectUsers: any;
    kanbanColumns: any;
    usersProjects: any;
    usersProject: any;
}