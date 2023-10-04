// express.d.ts
import 'express-session';


declare module 'express-session' {
    interface SessionData {
        userId: number;
        fullName: string;
        email: string;
        isAdmin: boolean;
    
    }
  }