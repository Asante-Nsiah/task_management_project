import { Request, Response } from "express";
import passport from "passport";
import { collaboratorsArray } from "./collaborators";
import { logger } from "../route/logger";
import { AppDataSource } from "../route/data-source";
import { Users } from "../modules/user-entity";
import { ProjectRepository } from "../repository/project-repository";





const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");





export  const userBoard = async (request: Request, response: Response) => {
  const {full_name, email, collaboratorFullName, collaboratorEmail} = request.body;
    try {
      const isAuthenticated = request.query.authenticated === 'true';



      let userFullName = full_name;
      let userEmail = email;
      
    //   // Check if the user is already authenticated with a JWT token
    // if (!request.headers.authorization) {
    //     // If not authenticated, render the login view or handle it as needed
    //     response.render("login"); // You can replace "login" with the appropriate view
    //     return;
    //   }
       

        const user = await AppDataSource
        .getRepository(Users)
        .createQueryBuilder()
        .where("email = :email", {email})
        .getOne();

      if (!user){
        const message = `Login denied.`;
        logger.info(`${message} - ${email}`);
        response.status(403).json({message});
        return;
      }
      // const connection = AppDataSource;
      // const projectRepository = connection.getCustomRepository(ProjectRepository);
      // const projects = await projectRepository.find(); 
    

      
      
    // Extract project names from the fetched projects
    // const projectNames = projects.map((project) => project.name);

    const connection = AppDataSource;
      const userRepository = connection.getRepository(Users);
      const collaborator = await userRepository.findOne({ where: { email: collaboratorEmail, full_name: collaboratorFullName } });

      if (!collaborator) {
          return response.status(404).json({ message: 'Collaborator not found' });
      }

      

        const { isAdmin} = user;
        const authJwt = {
          userId: user.id,
          email,
          isAdmin
        };
  
        const authJwtToken = await jwt.sign(authJwt, JWT_SECRET);
        console.log(authJwtToken);
  
        request.headers.authorization = `Bearer ${authJwtToken}`;   

        if (isAuthenticated){
        response.render("user-board", {userFullName, userEmail,collaboratorFullName, collaboratorEmail, collaboratorsArray});
      } else {
        // Handle unauthorized access (e.g., redirect to login or show an error page)
        response.status(403).send('Access Denied');
      }
    } catch (error) {
        logger.error('Error rendering User board view:', error);
        response.status(500).send('Internal Server Error');
    }
};


