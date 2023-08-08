import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user-entity'; // Assuming this is the file where the User entity is defined
import { KanbanColumn } from './kanban-entity'; // Assuming this is the file where the KanbanColumn entity is defined

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    title!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'date', nullable: true })
    deadline?: Date;

    @ManyToOne(() => User, user => user.assignedTasks, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'assignee_id' })
    assignee!: User;

    @ManyToOne(() => KanbanColumn, column => column.tasks, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'column_id' })
    column!: KanbanColumn;
}
