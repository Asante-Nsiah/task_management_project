import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { logger } from "../route/logger";
import { AppDataSource } from "../route/data-source";
import { Users } from "../modules/user-entity";
import bcrypt from "bcrypt";


const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

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

      let redirectUrl = '/user-dashboard'; // Default to user dashboard

    if (email === 'admin@task123.com') {
      // If user's email is "admin@task123.com", redirect to admin dashboard
      redirectUrl = '/admin';
    }


      const authJwt = {
        userId: user.id,
        email,
        isAdmin
      };

      const authJwtToken = await jwt.sign(authJwt, JWT_SECRET);

      response.status(200).json({
        user:
        email,
        full_name,
        isAdmin
      })

    }
    catch(error){
      logger.error(`Error calling login()`);
      return next(error);
    }
  }



  

