// express.d.ts
import 'express-session';


declare module 'express-session' {
    interface SessionData {
      user: {
        userId: string;
        full_name: string;
        email: string;
        // isAdmin: boolean;
      
      };
    }
  }