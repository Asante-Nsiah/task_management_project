import dotenv from "dotenv";

const result = dotenv.config();

import "reflect-metadata";
import { DataSource } from "typeorm";

import { AppDataSource } from "../route/data-source";
import { Users } from "./user-entity";
import bcrypt from "bcrypt";
import { Repository } from "typeorm";

export async function populateDb()  {
  
    // const dataSource = AppDataSource;
    // const connection = await dataSource.connect();
    // const userRepository = connection.getRepository(Users);
    // console.log(`Database connection ready.`);
  
    // const user = await userRepository.create({
    //   full_name: "Admin",
    //   email: "admin@task123.com",
    //   password: await bcrypt.hash("adminpassword123", 10),
    //   isAdmin: true,
    // });
  
    // await userRepository.save(user);
  
    // console.log(user);

};

// populateDb()
//     .then(() => {
//         console.log(`Finished populating database`);
//         process.exit(0);

//     })
//     .catch(err => {
//         console.error(`error populating database.`, err);
//     });


