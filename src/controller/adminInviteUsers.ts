import { Request, Response } from 'express';
import { logger } from '../route/logger';
import { getRepository } from 'typeorm';
import nodemailer from "nodemailer";
import { Invitation } from '../modules/invitation-entity';



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


  export async function sendInvitation(request: Request, response: Response) {
    try {

      const { email, fullName } = request.body;

      const defaultPasswordUser = generateRandomPassword(12);
  
      // Save the invitation to the database
    const invitationRepository = getRepository(Invitation);
    const invitation = new Invitation(email, fullName, defaultPasswordUser);
    await invitationRepository.save(invitation);
  
      
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
  
      const mailOptions = {
        from: "demoproject369@gmail.com",
        to: email,
        subject: "Invitation to Asante Task Management Board",
        text: `Hello ${fullName},

        You have been invited to our Asante Task Management Board platform.
        
        Login Credentials:
        Email: ${email}
        Temporary Password: ${defaultPasswordUser}
        
        Please use the following link to log in and access your account:
        [Login Link]
        
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
  
//   export default { sendInvitation };