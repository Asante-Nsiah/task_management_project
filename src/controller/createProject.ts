import express, { Request, Response } from "express";
import { logger } from "../route/logger";
import { AppDataSource } from "../route/data-source";
import { Users } from "../modules/user-entity";
import { collaboratorsArray } from "./collaborators";
import { Project } from "../modules/project-entity";
import nodemailer from "nodemailer";
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';



const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");


export  const createProject = async (request: Request, response: Response) => {
  const {full_name, email, projectName, shortDescription} = request.body;
    try {
       
        const isAuthenticated = request.query.authenticated === 'true';
       
      let userFullName = full_name;
      let userEmail = email;

      const connect = await AppDataSource;
      const projectRepository = connect.getRepository(Project)
      const userRepository = connect.getRepository(Users);
      
      //  Find the user by email
      const userProject = await userRepository.findOne({where:{email} });

      if (!userProject) {
          // Handle the case where the user is not found
          logger.error('User not found');
          return response.status(404).send('User not found');
        }

      const project = new Project();
      project.name = projectName;
      project.description = shortDescription;
      project.owner = userProject;


      await projectRepository.save(project);

      // Clear the collaboratorsArray for the next project
      collaboratorsArray.length = 0;



      if (isAuthenticated){
        await sendEmailNotifications(userProject, project);

      
      } else {
        // Handle unauthorized access (e.g., redirect to login or show an error page)
        response.status(403).send('Access Denied');
      }
      

  
      response.render('create-project', {userFullName, userEmail, collaboratorsArray });
    } catch (error) {
        logger.error('Error creating project:', error);
        response.status(500).send('Internal Server Error');
    }
}







const transporter = nodemailer.createTransport({
  // pool: true,
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user:  "dca4a7f2c037d4",
    pass: "ca037e584be699"
  },
 
});


const sendEmailNotifications = async (owner: Users, project: Project) => {
  const ownerEmail = owner.email;
  const collaboratorsEmails = collaboratorsArray.map((collaborator) => collaborator.email);

  try {
    // Send email notifications to the project owner
    await transporter.sendMail({
      from: 'demoproject369@gmail.com', // Your email address
      to: ownerEmail,
      subject: 'New Project Created',
      text: `Hello ${owner.full_name},\n\nYour new project "${project.name}" has been created.`,
    });

    // Send email notifications to collaborators
    await Promise.all(collaboratorsEmails.map(async (collaboratorEmail) => {
      await transporter.sendMail({
        from: 'your-email@example.com', // Your email address
        to: collaboratorEmail,
        subject: 'You Are Added as a Collaborator',
        text: `Hello,\n\nYou have been added as a collaborator to the project "${project.name}" by ${owner.full_name} as the product owner.`,
      });
    }));
    console.log('Emails sent successfully');
  } catch (error) {
    logger.error('Error sending email notifications:', error);
    // Handle email sending errors here
    
  }
};









// Display the create-project form
export const displayCreateProject = (request: Request, response: Response) => {
  const { full_name, email } = request.body;
  const isAuthenticated = request.query.authenticated === 'true';
  let userFullName = full_name;
  let userEmail = email;
  // Render the create-project form
  response.render("create-project", { full_name, email, userFullName, userEmail, collaboratorsArray});
};