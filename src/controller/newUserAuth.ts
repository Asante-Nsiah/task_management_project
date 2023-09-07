import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { logger } from "../route/logger";
import { AppDataSource } from "../route/data-source";
import { Users } from "../modules/user-entity";
import bcrypt from "bcrypt";
import defaultPasswordUser from "./adminInviteUsers"

const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

export default async  function authenticateNewUser(
  request: Request, response: Response, next: NextFunction) {
    try{
        logger.debug(`Called login()`);

      const {email, password} = request.body;
    
      // if (!email) {
      //   throw `Could not extract the email from the request, aborting.`;
      // }      
      // if (!password) {
      //   throw `Could not extract the plain text password from the request, aborting.`;
      // }   
      if (!email || !password) {
        throw new Error('Email and password are required.'); 
      }  
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

      const passwordCompare = request.body.password;
      const storedHashedDefaultPassword = user.password;

      const isPasswordCorrect = await bcrypt.compare(passwordCompare, storedHashedDefaultPassword);
      let viewName: string;
      let userEmail;
      let userFullName;

      const {full_name, isAdmin} = user;

if (isPasswordCorrect) {
  // Passwords match, redirect the user to set a new password
  viewName = 'new-password';
} else if (email === 'admin@task123.com') {
  // If the user's email is 'admin@task123.com', render the admin dashboard
  viewName = 'admin-board';
} else {
  // For all other users, set the viewName to 'user-board'
  viewName = 'user-board';
  userEmail = email; // Set email for the user
  userFullName = full_name; // Set full_name for the user
  
}

response.render(viewName, { userEmail, userFullName });

      // if (!isPasswordCorrect){
      //   const message = `Login denied.`;
      //   logger.info(`${message} -user with ${email} has entered the wrong password.`);
      //   response.status(403).json({message});
      //   return;
      // }

      logger.info(`User ${email} has now logged in.`);

      const authJwt = {
        userId: user.id,
        email,
        isAdmin
      };

      const authJwtToken = await jwt.sign(authJwt, JWT_SECRET);
      console.log(authJwtToken);

      request.headers.authorization = `Bearer ${authJwtToken}`;
      // response.status(200).json({
      //   user:
      //   email,
      //   full_name,
      //   isAdmin
      // })
     
    }
    catch(error){
      logger.error(`Error calling login()`);
      return next(error);
    }
  }



  

