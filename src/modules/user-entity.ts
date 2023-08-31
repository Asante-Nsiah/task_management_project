import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class Users {
    static id(arg0: null, id: any) {
      throw new Error("Method not implemented.");
    }
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: 'full_name', length: 255 })
    full_name: string;

    @Column({ length: 255 })
    email: string;

    @Column({ default: false }) 
    isAdmin: boolean;

    @Column({ length: 255 })
    password: string
    projects: any;
    userProjects: any;
    assignedTasks: any;

    constructor() {
        this.id = 0;
        this.full_name = '';
        this.email = '';
        this.password = '';
        this.isAdmin = false;
    }
}

