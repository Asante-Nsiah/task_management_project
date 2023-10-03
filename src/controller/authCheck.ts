import { Request, Response, NextFunction } from "express";
import { logger } from "../route/logger";
import jwt, { Secret, VerifyErrors } from "jsonwebtoken";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { getRepository } from "typeorm";
import { Users } from "../modules/user-entity";

const JWT_SECRET: string = process.env.JWT_SECRET || '';


 

export default function configureJwt(passport: any) {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      };

   passport.use(
    new JwtStrategy(opts, async (jwt_payload: any, done: any) => {
      try {
        const userRepository = getRepository(Users);
        const user = await userRepository.findOne({ where: { email: jwt_payload.email } });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err);
      }
    })
  );
}



export async function checkIfAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  passport.authenticate(
    "jwt",
    { session: false },
    async (err: VerifyErrors | null, user: Users | undefined) => {
      try {
        if (err) {
          logger.error("Error during JWT authentication:", err);
          throw err;
        }

        if (!user) {
          logger.info("User not found in JWT authentication");
          return response.status(403).json({ error: "Access denied" });
        }

        // Verify and decode the JWT token
        const authJwtToken = request.headers.authorization as string;
        if (!authJwtToken) {
          throw new Error("Authentication JWT is required");
        }

        const decodedUser = jwt.verify(
          authJwtToken,
          JWT_SECRET as Secret
        ) as Users;

        // Check if the decoded user's email matches the user's email in the database
        if (decodedUser && decodedUser.email === user.email) {
          // Log the decoded user from JWT
          logger.info("Authentication JWT successfully decoded:", decodedUser);

          // Set the user information on the request
          request.user = user;
          next();
        } else {
          logger.error("User email in JWT does not match the database");
          response.status(403).json({ error: "Access denied" });
        }
      } catch (err) {
        logger.error(
          "Could not validate the authentication JWT, access denied.",
          err
        );
        response.sendStatus(403);
      }
    }
  )(request, response, next);
}

