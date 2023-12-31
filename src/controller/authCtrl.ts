import { Request, Response, NextFunction} from "express";
import  {AppDataSource }  from "../route/data-source";
import { logger } from "../route/logger";
import { Invitation } from "../modules/invitation-entity";
import { Repository, createConnection, getRepository} from "typeorm";
import nodemailer from "nodemailer";
import passport from "passport";
import { Users } from "../modules/user-entity";



export  const loginRender = (request: Request, response: Response) => {
    try {
        response.render("login");
    } catch (error) {
        logger.error('Error rendering login view:', error);
        response.status(500).send('Internal Server Error');
    }
};




export  const setPassword = (request: Request, response: Response) => {
    try {
        response.render("new-password");
    } catch (error) {
        logger.error('Error rendering setPassword view:', error);
        response.status(500).send('Internal Server Error');
    }

  }
const revokedTokens: string[] = [];

export const logout = (request: Request, response: Response) => {
  // Destroy the user's session to log them out
  request.session.destroy((error) => {
    if (error) {
      console.error("Error destroying session:", error);
    }
    response.redirect("/login"); // Redirect to the login page
  });
};

export const checkTokenValidity = ((req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization; 

  // Check if the token is revoked
  if (token && revokedTokens.includes(token)) {
    // Token is revoked; deny access (you can also send a 403 Forbidden status)
    res.status(403).send('Access Denied');
  } else {
    // Token is valid; proceed with the request
    next();
  }
});







