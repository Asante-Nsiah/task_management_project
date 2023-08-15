import { Request, Response } from "express";
import { AppDataSource } from "../route/data-source";
import { logger } from "../route/logger";
import { Invitation } from "../modules/invitation-entity";
import { Repository, getRepository } from "typeorm";
import nodemailer from "nodemailer";



export  const loginRender = (request: Request, response: Response) => {
    try {
        response.render("login");
    } catch (error) {
        logger.error('Error rendering login view:', error);
        response.status(500).send('Internal Server Error');
    }
};



// Generate a default password
function generateRandomPassword(length: number): string {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let defaultPassword = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      defaultPassword += charset[randomIndex];
    }
  
    return defaultPassword;
  }
  
  export const invite = async (request: Request, response: Response) => {
    try {
      const { email, full_name } = request.body;
      const defaultPassword = generateRandomPassword(12);
  
      const invitation = new Invitation(email, full_name, defaultPassword);
      invitation.email = email;
      invitation.full_name = full_name;
      invitation.defaultPassword = defaultPassword;
  
      // Use AppDataSource for your TypeORM connection
      await AppDataSource.initialize();

      const invitationRepository: Repository<Invitation> = getRepository(Invitation);
      await invitationRepository.save(invitation);
  
      // Send email to the invited user using Nodemailer
      const transporter = nodemailer.createTransport({
        pool: true,
        host: "smtp.gmail.com",
        port: 465,
        auth: {
          user: 'demoproject369@gmail.com',
          pass: 'ikuckqlhraenviig'
        },
        tls: {
        
          rejectUnauthorized: false,
        },
      });
  
      const mailOptions = {
        from: "demoproject369@gmail.com",
        to: email,
        subject: "Invitation to Asante Task Management Board",
        text: `Hello ${full_name},

        You have been invited to our Asante Task Management Board platform.
        
        Login Credentials:
        Email: ${email}
        Temporary Password: ${defaultPassword}
        
        Please use the following link to log in and access your account:
        [Login Link]
        
        Upon your first login, you will be required to set a new password for your account. This is to ensure the security of your account and your tasks.
        
        Please don't hesitate to contact us if you have any questions or need assistance.
        
        Best regards,
        The Asante Task Management Team`
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          response.status(500).json({ message: "Error sending invitation email." });
        } else {
          console.log("Email sent: " + info.response);
          response.status(201).json({ message: "Invitation sent successfully!" });
        }
      });
  
      await AppDataSource.destroy(); // Close the database connection
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Error sending invitation." });
    }
  };


