import { Request, Response, NextFunction } from "express";
import { logger } from "../route/logger";
import jwt, { Secret } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// export function checkIfAuthenticated(
//     request: Request,
//     response: Response,
//     next: NextFunction
//   ) {
//     const authHeader = request.headers.authorization;
  
//     if (!authHeader) {
//       return response.status(403).json({ error: 'Authentication JWT is required' });
//     }
  
//     // Extract the token from the Authorization header
//     const tokenParts = authHeader.split(' ');
//     if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
//       return response.status(403).json({ error: 'Invalid Authorization header format' });
//     }
  
//     const authJwtToken = tokenParts[1]; // Extracted JWT token
  
//     // Verify the JWT token
//     try {
//       const user = jwt.verify(authJwtToken, JWT_SECRET as Secret);
//       request['user'] = user; // Store the user information in the request object
//       next();
//     } catch (error) {
//       return response.status(403).json({ error: 'Invalid JWT token' });
//     }
//   }

export function checkIfAuthenticated(
    request: Request, response: Response, next: NextFunction
){

    const authJwtToken = request.headers.authorization;
    console.log("Request Headers:", request.headers.authorization);
    if(!authJwtToken){
        logger.info(`The authentication JWT is not present, access denied`);
        return response.status(403).json({ error: 'Authentication JWT is required' });
        
    }

    checkJwtValidity(authJwtToken)
    .then(user =>{

        logger.info(`Authentication JWT successfully decoded:`, user);

        request["user"] = user;

        next();
    })
    .catch(err =>{
        logger.error(`Could not validate the authentication JWT, access denied.`, err);
        response.sendStatus(403);
    });
}

async function checkJwtValidity(authJwtToken:string) {

   const user =  jwt.verify(authJwtToken, JWT_SECRET as Secret);
   logger.info(`Found user details in JWT:`, user);
   return user;
}