// config/passportConfig.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getConnectionManager, Connection } from 'typeorm';
import bcrypt from "bcrypt";
import { Users } from "../modules/user-entity";
import { UsersRepository } from "../repository/user-repository"; 
import { EntityManager } from 'typeorm';
import { AppDataSource } from "../route/data-source";
import { logger } from "../route/logger";


const connectionManager = getConnectionManager();
const connection = connectionManager.get('AppDataSource'); // Replace 'AppDataSource' with your connection name

const userRepository = connection.getCustomRepository(UsersRepository); // Create an instance of UserRepository

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await userRepository.findOne({ where: {email} });

      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
  try {
    const user = await userRepository.findOne(id);
    logger.error(user);
    done(null, user);
  } catch (error) {
    done(error);
  }
});