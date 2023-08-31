// config/passportConfig.ts
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { EntityManager, getRepository } from 'typeorm';
import { Users } from "../modules/user-entity";
import bcrypt from 'bcrypt';


export default function initialize(passport: any) {
  const authenticateUser = async (email: string, password: string, done: any) => {
    try {
      const userRepository = getRepository(Users);
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return done(null, false, { message: "No user with that email address" });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.log(err);
        }
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Password is incorrect" });
        }
      });
    } catch (err) {
      return done(err);
    }
  };

  passport.use(
    new LocalStrategy({ usernameField: "email", passwordField: "password" }, authenticateUser)
  );

  passport.serializeUser((user: any, done: any) => done(null, user.id));
  passport.deserializeUser((id: number, done: any) => {
    try {
      const userRepository = getRepository(Users);
      userRepository.findOne({ where: { id } }).then((user) => {
        if (!user) {
          return done("User not found");
        }
        return done(null, user);
      });
    } catch (err) {
      return done(err);
    }
  });
}

