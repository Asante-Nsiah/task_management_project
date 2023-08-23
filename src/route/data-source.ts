import {DataSource} from "typeorm";
import { UsersProject } from "../modules/userproject-entity";
import { Task } from "../modules/task-entity";
import { Users } from "../modules/user-entity";
import { KanbanColumn } from "../modules/kanban-entity";
import { Project } from "../modules/project-entity";
import { Invitation } from "../modules/invitation-entity";
import path from "path";


export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    ssl: true,
    extra:{
        ssl : {
            rejectUnauthorized: false
        }
    },
    entities: [
        path.join(__dirname, "./user-entity/Users.js"),
        "./user-entity/Users.js",
        "src/modules/**/*.js",
        Users,
        Project,
        KanbanColumn,
        Task,
        UsersProject,
        Invitation,
    
    ],
    synchronize:true,
    logging:true
})