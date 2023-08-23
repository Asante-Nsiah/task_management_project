import { EntityManager, createConnection, getConnection } from 'typeorm';
// import { UserRepository } from '../repository/user-repository'; 

import bcrypt from 'bcrypt';
// import { connectDatabase } from '../route/databaseConnect';
import { logger } from '../route/logger';
import { AppDataSource } from '../route/data-source';

import "reflect-metadata";


// export async function createAdminUser() {
//   try {
   
//    await AppDataSource.initialize();
   
//     const user = new User();
//       user.fullName= 'Admin';
//       user.email= 'admin2@task.com';
//       user.password= 'adminPassword';
//       user.isAdmin= false;
    
//       await AppDataSource.manager.save(user); 
 
  
//     console.log(' user created successfully.');
//   } catch (error) {
//     console.error('Error creating admin:', error);
//   }
// }

// createAdminUser();