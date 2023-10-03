import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { logger } from "../route/logger";
import { AppDataSource } from "../route/data-source";
import { Users } from "../modules/user-entity";
import bcrypt from "bcrypt";
import { verifyToken } from "./verifyToken";
import cookieParser from "cookie-parser";

const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

// Initialize cookie-parser middleware



export default async  function authenticateUser(
  request: Request, response: Response, next: NextFunction) {
    try{
        logger.debug(`Called login()`);

      const {email, password} = request.body;
      if (!email) {
        throw `Could not extract the email from the request, aborting.`;
      }      
      if (!password) {
        throw `Could not extract the plain text password from the request, aborting.`;
      }   
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

      const isPassword = await bcrypt.compare(password, user.password);
      if (!isPassword){
        const message = `Login denied.`;
        logger.info(`${message} -user with ${email} has entered the wrong password.`);
        response.status(403).json({message});
        return;
      }

      logger.info(`User ${email} has now logged in.`);

      const {full_name, isAdmin} = user;

      // Determine the view to render based on the user's email
    let viewName = 'user-board'; // Default to user dashboard

    if (email === 'admin@task123.com') {
      // If user's email is 'admin@task123.com', render the admin dashboard
      viewName = 'admin-board';
    }

      // Store user details in the session
    request.session.user = {
      userId: `${user.id}`,
      email,
      // isAdmin,
      full_name
    };

      // const authJwtToken = await jwt.sign(authJwt, JWT_SECRET);
      // console.log(authJwtToken);
      // response.cookie('jwtToken', authJwtToken, { httpOnly: true });


      // request.headers.authorization = `Bearer ${authJwtToken}`;

      await verifyToken(request, response, async () => {
        // Render the view after successful token verification
        response.render(viewName, { user });
      });
      
      response.render(viewName, { user });
    }
    catch(error){
      logger.error(`Error calling login()`);
      return next(error);
    }
  }



  

