import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { logger } from "../route/logger";
import { AppDataSource } from "../route/data-source";
import { Users } from "../modules/user-entity";
import bcrypt from "bcrypt";

export default async function authenticateNewUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    logger.debug(`Called login()`);

    const { email, password } = request.body;

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    const user = await AppDataSource.getRepository(Users).createQueryBuilder()
      .where("email = :email", { email })
      .getOne();

    if (!user) {
      const message = `Login denied.`;
      logger.info(`${message} - ${email}`);
      response.status(403).json({ message });
      return;
    }

    const passwordCompare = request.body.password;
    const storedHashedDefaultPassword = user.password;

    const isPasswordCorrect = await bcrypt.compare(
      passwordCompare,
      storedHashedDefaultPassword
    );

    let viewName: string;
    let userEmail: string | undefined;
    let userFullName: string | undefined;

    if (isPasswordCorrect) {
      // Passwords match, redirect the user to set a new password
      viewName = "new-password";
    } else if (email === "admin@task123.com") {
      // If the user's email is 'admin@task123.com', render the admin dashboard
      viewName = "admin-board";
    } else {
      // For all other users, set the viewName to 'user-board'
      viewName = "user-board";
      userEmail = email; // Set email for the user
      userFullName = user.full_name; // Set full_name for the user
    }

    // Store user data in the session
    request.session.userId = user.id;
    request.session.email = email;
    request.session.fullName = userFullName;
    request.session.isAdmin = user.isAdmin;

    response.render(viewName, { userEmail, userFullName });

    logger.info(`User ${email} has now logged in.`);
  } catch (error) {
    logger.error(`Error calling login()`);
    return next(error);
  }
}
