// config/jwtConfig.ts
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { EntityManager, getRepository } from 'typeorm';
import { Users } from '../modules/user-entity';

const JWT_SECRET = process.env.JWT_SECRET;

export default function configureJwt(passport: any) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  };

   passport.use(
    new JwtStrategy(opts, async (jwt_payload: any, done: any) => {
      try {
        const userRepository = getRepository(Users);
        const user = await userRepository.findOne({ where: { id: jwt_payload.userId } });

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
