import { Request, Response } from "express";
import passport from "passport";
import { logger } from "../route/logger";
import { AppDataSource } from "../route/data-source";
import { Users } from "../modules/user-entity";
import { collaboratorsArray } from "./collaborators";



const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");


export  const createProject = async (request: Request, response: Response) => {
    try {
        const {full_name, email} = request.body;
      
    //     const user = await AppDataSource
    //     .getRepository(Users)
    //     .createQueryBuilder()
    //     .where("email = :email", {email})
    //     .getOne();
    //     console.log(user);
    //   if (!user){
    //     const message = `Login denied.`;
    //     logger.info(`${message} - ${email}`);
    //     response.status(403).json({message});
    //     return;
    //   }
      let userFullName = full_name;
      let userEmail = email;
    //   const connection = AppDataSource;
    //   const userRepository = connection.getRepository(Users);
    //   const collaboratorsArray = await userRepository.find();
      
        // const { isAdmin} = user;
        // const authJwt = {
        //   userId: user.id,
        //   email,
        //   isAdmin
        // };
  
        // const authJwtToken = await jwt.sign(authJwt, JWT_SECRET);
        // console.log(authJwtToken);
  
        // request.headers.authorization = `Bearer ${authJwtToken}`;  
        response.render("create-project", {userFullName, userEmail, collaboratorsArray});  
    } catch (error) {
        logger.error('Error rendering create project view:', error);
        response.status(500).send('Internal Server Error');
    }
};