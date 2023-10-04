import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Users } from './user-entity'; 
import { KanbanColumn } from './kanban-entity'; 

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

    @ManyToMany(() => Users)
    @JoinTable()
     assignees!: Users[];

    @ManyToOne(() => KanbanColumn, column => column.tasks, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'column_id' })
    column!: KanbanColumn;
}
