import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';


const JWT_SECRET: string = process.env.JWT_SECRET || 'default-secret-key';


export async function verifyToken(
  request: Request, response: Response, next: NextFunction
) {
  try {
    const token = request.headers['authorization'];

    if (!token) {
      return response.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return response.status(401).json({ message: 'Failed to authenticate token' });
      }

      // Add the decoded user information to the request object
      request.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    response.status(500).send('Internal Server Error');
  }
}
