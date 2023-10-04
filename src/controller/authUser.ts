import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { logger } from "../route/logger";
import { AppDataSource } from "../route/data-source";
import { Users } from "../modules/user-entity";
import bcrypt from "bcrypt";

import cookieParser from "cookie-parser";

export default async function authenticateUser(
  request: Request, response: Response, next: NextFunction) {
  try {
    logger.debug(`Called login()`);

    const { email, password } = request.body;
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const user = await AppDataSource
      .getRepository(Users)
      .createQueryBuilder()
      .where("email = :email", { email })
      .getOne();

    if (!user) {
      const message = `Login denied.`;
      logger.info(`${message} - ${email}`);
      response.status(403).json({ message });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const message = `Login denied.`;
      logger.info(`${message} - user with ${email} has entered the wrong password.`);
      response.status(403).json({ message });
      return;
    }

    logger.info(`User ${email} has now logged in.`);

    // Store user data in the session
    request.session.userId = user.id;
    request.session.email = user.email;
    request.session.fullName = user.full_name;
    request.session.isAdmin = user.isAdmin;

    // Determine the view to render based on the user's role
    let viewName = 'user-board'; // Default to user dashboard

    if (user.email === 'admin@task123.com') {
      // If user's email is 'admin@task123.com', render the admin dashboard
      viewName = 'admin-board';
    }

    response.render(viewName, { user });

  } catch (error) {
    logger.error(`Error calling login()`);
    return next(error);
  }
}














  

