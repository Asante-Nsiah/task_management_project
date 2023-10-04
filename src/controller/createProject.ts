import express, { Request, Response } from "express";
import { logger } from "../route/logger";
import { AppDataSource } from "../route/data-source";
import { Users } from "../modules/user-entity";
import { collaborators, collaboratorsArray } from "./collaborators";
import { Project } from "../modules/project-entity";
import nodemailer from "nodemailer";
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';


export const createProjectGet = async (request: Request, response: Response) => {
  try {
    const { fullName, email } = request.session;
   
    if (!fullName || !email) {
      console.log(fullName);
      // response.redirect('/login'); // Redirect to the login page if fullName or email is missing
      return response.status(500).json({ error: 'Logout failed.' });
    }

    collaboratorsArray.length = 0;

    response.render('create-project', { fullName, email, collaboratorsArray });
  } catch (error) {
    logger.error('Error creating project:', error);
    response.status(500).send('Internal Server Error');
  }
};



export const createProject = async (request: Request, response: Response) => {
 
  try {
    const {  email, projectName, shortDescription } = request.body;
    // const { fullName, email } = request.session;
   
    // if (!fullName || !email) {
    //   console.log(fullName);
    //   // response.redirect('/login'); // Redirect to the login page if fullName or email is missing
    //   return response.status(500).json({ error: 'Logout failed.' });
    // }



    const connect = await AppDataSource;
    const projectRepository = connect.getRepository(Project);
    const userRepository = connect.getRepository(Users);

    // Find the user by email
    const userProject = await userRepository.findOne({ where: { email } });

    if (!userProject) {
      // Handle the case where the user is not found
      logger.error("User not found");
      return response.status(404).send("User not found");
    }

    const project = new Project();
    project.name = projectName;
    project.description = shortDescription;
    project.owner = userProject;

    await projectRepository.save(project);

    // Clear the collaboratorsArray for the next project
    collaboratorsArray.length = 0;

    
    await sendEmailNotifications(project, request.session, collaboratorsArray);

      response.status(201).json({ message: 'Project created successfully'});
  } catch (error) {
    logger.error("Error creating project:", error);
    response.status(500).send("Internal Server Error");
  }
};

const transporter = nodemailer.createTransport({
  // pool: true,
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user:  "dca4a7f2c037d4",
    pass: "ca037e584be699"
  },
});


const sendEmailNotifications = async (project: Project, session: any, collaboratorsArray: Array<{ full_name: string, email: string }>) => {
  const ownerEmail = session.email; // Get the owner's email from the session
  const collaboratorsEmails = collaboratorsArray.map((collaborator) => collaborator.email);

  try {
    // Send email notifications to the project owner
    await transporter.sendMail({
      from: 'demoproject369@gmail.com', // Your email address
      to: ownerEmail,
      subject: 'New Project Created',
      text: `Hello ${session.fullName},\n\nYour new project "${project.name}" has been created.`,
    });

    // Send email notifications to collaborators if there are any
    if (collaboratorsEmails.length > 0) {
      await Promise.all(collaboratorsEmails.map(async (collaboratorEmail) => {
        await transporter.sendMail({
          from: 'demoproject369@gmail.com', // Use the owner's email as the sender
          to: collaboratorEmail,
          subject: 'You Are Added as a Collaborator',
          text: `Hello,\n\nYou have been added as a collaborator to the project "${project.name}" by ${session.fullName} as the product owner.`,
        });
      }));
      console.log('Emails sent successfully to collaborators');
    }

    console.log('Emails sent successfully');
  } catch (error) {
    logger.error('Error sending email notifications:', error);
    // Handle email sending errors here
  }
};











// export  const createProject = async (request: Request, response: Response) => {
//   const {full_name, email, projectName, shortDescription} = request.body;
//     try {
       
//         const isAuthenticated = request.query.authenticated === 'true';
       
//       let userFullName = full_name;
//       let userEmail = email;

//       const connect = await AppDataSource;
//       const projectRepository = connect.getRepository(Project)
//       const userRepository = connect.getRepository(Users);
      
//       //  Find the user by email
//       const userProject = await userRepository.findOne({where:{email} });

//       if (!userProject) {
//           // Handle the case where the user is not found
//           logger.error('User not found');
//           return response.status(404).send('User not found');
//         }

//       const project = new Project();
//       project.name = projectName;
//       project.description = shortDescription;
//       project.owner = userProject;


//       await projectRepository.save(project);

//       // Clear the collaboratorsArray for the next project
//       collaboratorsArray.length = 0;



//       if (isAuthenticated){
//         await sendEmailNotifications(userProject, project);

      
//       } else {
//         // Handle unauthorized access (e.g., redirect to login or show an error page)
//         response.status(403).send('Access Denied');
//       }
      

  
//       response.render('create-project', {userFullName, userEmail, collaboratorsArray });
//     } catch (error) {
//         logger.error('Error creating project:', error);
//         response.status(500).send('Internal Server Error');
//     }
// }







