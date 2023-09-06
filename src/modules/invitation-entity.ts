import { Entity, PrimaryGeneratedColumn, Column, Unique, Repository } from "typeorm";

@Entity()
@Unique(['email'])
export class Invitation {
  @PrimaryGeneratedColumn()
  id: any;

  @Column()
  email: string;

  @Column({ name: 'full_name', length: 255 })
  full_name: string;

  @Column({ name: 'password', length: 255 })
  password: string;
    full_Name: any;

  constructor(email: string, full_name: string, password: string) {
    
    this.email = email;
    this.full_name = full_name;
    this.password = password;
  }
}