import { Request, Response, NextFunction } from "express";
import { logger } from "../route/logger";
import jwt, { Secret, VerifyErrors } from "jsonwebtoken";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { getRepository } from "typeorm";
import { Users } from "../modules/user-entity";



export function isAuthenticated(request: Request, response: Response, next: NextFunction) {
  const userId = request.session?.userId;

  if (userId) {

    next();
  } else {
   
      response.redirect('/login'); // Redirect to login page
  }
}


