import { Request, Response } from 'express';
import { logger } from '../route/logger';
import { getConnection, getRepository } from 'typeorm';
import nodemailer from "nodemailer";
import { Invitation } from '../modules/invitation-entity';
import { AppDataSource } from '../route/data-source';
import { Users } from '../modules/user-entity';
import bcrypt from 'bcrypt';


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

  const defaultPasswordUser = generateRandomPassword(12);

  export default async function sendInvitation(request: Request, response: Response) {
    try {

      const { email, full_name } = request.body;
        console.log(`Full name:` , request.body.full_name, request.body.email);

        if (!request.body.full_name) {
            return response.status(400).json({ error: 'Full name is required' });
          }
      // const defaultPasswordUser = generateRandomPassword(12);
  
    
    const connection = AppDataSource;
    const invitationRepository = connection.getRepository(Users);
    const password = await bcrypt.hash(defaultPasswordUser, 10);
    const invitation = new Invitation(email, full_name, password);
    await invitationRepository.save(invitation);
    console.log(invitation);
      
      // Send email to the invited user using Nodemailer
      const transporter = nodemailer.createTransport({
        // pool: true,
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user:  "dca4a7f2c037d4",
          pass: "ca037e584be699"
        },
       
      });
      let login = 'http://localhost:8000/login';
      const mailOptions = {
        from: "demoproject369@gmail.com",
        to: email,
        subject: "Invitation to Asante Task Management Board",
        text: `Hello ${full_name},

        You have been invited to our Asante Task Management Board platform.
        
        Login Credentials:
        Email: ${email}
        Temporary Password: ${defaultPasswordUser}
        
        Please use the following link to log in and access your account:
        ${login}
        
        Upon your first login, you will be required to set a new password for your account. This is to ensure the security of your account and your tasks.
        
        Please don't hesitate to contact us if you have any questions or need assistance.
        
        Best regards,
        The Asante Task Management Team`
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error(error);
          response.status(500).json({ message: "Error sending invitation email." });
        } else {
          console.log("Email sent: " + info.response);
          response.status(201).json({ message: "Invitation sent successfully!" });
        }
      });
  
      response.status(200).json({ message: 'Invitation sent successfully.' });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'Internal server error' });
    }
  }
  
 