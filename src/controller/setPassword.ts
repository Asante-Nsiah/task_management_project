import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getConnection } from 'typeorm';
import { Users } from '../modules/user-entity'; // Import your User entity
import { AppDataSource } from '../route/data-source';
import { UsersRepository } from '../repository/user-repository';

export async function setActualPassword(request: Request, response: Response) {
  try {
    const { email, tempPassword, newPassword } = request.body;

    // Retrieve the user from the database
    const connection = AppDataSource;
    const userRepository = connection.getRepository(Users);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    const isPasswordCorrect = (tempPassword);

    if (!isPasswordCorrect) {
      return response.status(401).json({ error: 'Incorrect old password' });
    }
    console.log(!isPasswordCorrect);
    // // Hash the new password and update it in the database
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    console.log(user.password);
    await userRepository.save(user); // Save the updated user object

    
    // Redirect the user to a success page or send a success response
    return response.status(200).json({ message: 'Password updated successfully' });
    // return response.redirect('/login');
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}
