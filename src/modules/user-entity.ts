import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'full_name', length: 255 })
    fullName: string;

    @Column({ length: 255 })
    email: string;

    @Column({ length: 255 })
    password: string;
    projects: any;
    userProjects: any;
    assignedTasks: any;

    constructor() {
        this.id = 0;
        this.fullName = '';
        this.email = '';
        this.password = '';
    }
}

