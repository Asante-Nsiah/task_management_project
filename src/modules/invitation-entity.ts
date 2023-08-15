import { Entity, PrimaryGeneratedColumn, Column, Unique, Repository } from "typeorm";

@Entity()
@Unique(['email'])
export class Invitation {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
  email: string;

  @Column({ name: 'full_name', length: 255 })
  fullName: string;

  @Column({ name: 'defaultPassword', length: 255 })
  defaultPassword: string;
    full_name: any;

  constructor(email: string, fullName: string, defaultPassword: string) {
    this.email = email;
    this.fullName = fullName;
    this.defaultPassword = defaultPassword;
  }
}