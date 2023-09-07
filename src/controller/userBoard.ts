import { Request, Response } from "express";
import passport from "passport";
import { logger } from "../route/logger";
import { AppDataSource } from "../route/data-source";
import { Users } from "../modules/user-entity";




const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");


export  const userBoard = async (request: Request, response: Response) => {
    try {
      const {full_name, email} = request.body;
      let userFullName = full_name;
      let userEmail = email;
        response.render("user-board", {userFullName, userEmail});

        const user = await AppDataSource
        .getRepository(Users)
        .createQueryBuilder()
        .where("email = :email", {email})
        .getOne();

      if (!user){
        const message = `Login denied.`;
        logger.info(`${message} - ${email}`);
        response.status(403).json({message});
        return;
      }

        const { isAdmin} = user;
        const authJwt = {
          userId: user.id,
          email,
          isAdmin
        };
  
        const authJwtToken = await jwt.sign(authJwt, JWT_SECRET);
        console.log(authJwtToken);
  
        request.headers.authorization = `Bearer ${authJwtToken}`;   

    } catch (error) {
        logger.error('Error rendering User board view:', error);
        response.status(500).send('Internal Server Error');
    }
};