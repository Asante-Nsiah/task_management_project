import { Request, Response } from "express";
import { logger } from "../route/logger";
import { AppDataSource } from "../route/data-source";
import { Users } from "../modules/user-entity";

const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

export const  projectBoard = async (request: Request, response: Response) =>{
    const {full_name, email} = request.body;
    try{
       
        const isAuthenticated = request.query.authenticated === 'true';


      let userFullName = full_name;
      let userEmail = email;

    //   const user = await AppDataSource
    //   .getRepository(Users)
    //   .createQueryBuilder()
    //   .where("email = :email", {email})
    //   .getOne();

    // if (!user){
    //   const message = `Login denied.`;
    //   logger.info(`${message} - ${email}`);
    //   response.status(403).json({message});
    //   return;
    // }
    
    //   const { isAdmin} = user;
    //   const authJwt = {
    //     userId: user.id,
    //     email,
    //     isAdmin
    //   };

    //   const authJwtToken = await jwt.sign(authJwt, JWT_SECRET);
    //   console.log(authJwtToken);

    //   request.headers.authorization = `Bearer ${authJwtToken}`;  
    if (isAuthenticated) {
        response.render("project", {userFullName, userEmail});
    } else {
        // Handle unauthorized access (e.g., redirect to login or show an error page)
        response.status(403).send('Access Denied');
      }
    }catch(error){
        logger.error(error);
        return response.status(500).json({ message: 'An error occurred while viewing project board' });
       

    }
}