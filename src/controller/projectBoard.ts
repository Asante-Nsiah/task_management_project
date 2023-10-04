import { Request, Response } from "express";
import { logger } from "../route/logger";
import { AppDataSource } from "../route/data-source";
import { Users } from "../modules/user-entity";
import { collaboratorsArray } from "./collaborators";

const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

export const  projectBoard = async (request: Request, response: Response) =>{
       
      try {
        const { fullName, email } = request.session;
        console.log(fullName);
        if (!fullName || !email) {
          response.redirect('/login'); // Redirect to the login page if fullName or email is missing
          return;
        }
        
        collaboratorsArray.length = 0;


        response.render('project', { fullName, email, collaboratorsArray});
    }catch(error){
        logger.error(error);
        return response.status(500).json({ message: 'An error occurred while viewing project board' });
       

    }
}