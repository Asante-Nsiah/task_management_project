import { Request, Response } from "express";
import passport from "passport";
import { collaboratorsArray } from "./collaborators";
import { logger } from "../route/logger";
import { AppDataSource } from "../route/data-source";
import { Users } from "../modules/user-entity";
import { ProjectRepository } from "../repository/project-repository";


export const userBoard = async (request: Request, response: Response) => {
  try {
    const { fullName, email } = request.session;
        console.log(fullName);
        if (!fullName || !email) {
          response.redirect('/login'); // Redirect to the login page if fullName or email is missing
          return;
        }
    
    // Get the user's full name and email from the session
    const userFullName = request.session.fullName;
    const userEmail = request.session.email;

    // You can continue with the rest of your code here

    response.render("user-board", {
      userFullName,
      userEmail,
      collaboratorsArray,
    });
  } catch (error) {
    logger.error('Error rendering User board view:', error);
    response.status(500).send('Internal Server Error');
  }
};



// const JWT_SECRET = process.env.JWT_SECRET;
// const jwt = require("jsonwebtoken");

// export const userBoard = async (request: Request, response: Response) => {
//   const { full_name, email, collaboratorFullName, collaboratorEmail } = request.body;

//   try {
//     const isAuthenticated = request.query.authenticated === 'true';

    
//     let userFullName = full_name;
//     let userEmail = email;


//     const connection = AppDataSource;
//     const userRepository = connection.getRepository(Users);
//     const collaborator = await userRepository.findOne({
//       where: { email: collaboratorEmail, full_name: collaboratorFullName }
//     });

//     if (!collaborator) {
//       return response.status(404).json({ message: 'Collaborator not found' });
//     }


//     if (isAuthenticated) {
//       response.render("user-board", { userFullName, userEmail, collaboratorFullName, collaboratorEmail, collaboratorsArray });
//     } else {
//       // Handle unauthorized access (e.g., redirect to login or show an error page)
//       response.status(403).send('Access Denied');
//     }
//   } catch (error) {
//     logger.error('Error rendering User board view:', error);
//     response.status(500).send('Internal Server Error');
//   }
// };
