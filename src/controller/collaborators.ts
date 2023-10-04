import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Users } from "../modules/user-entity";
import { AppDataSource } from "../route/data-source";
import { logger } from "../route/logger";


const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

export const collaboratorsArray: Array<{ full_name: string; email: string }> = [];

export const collaborators = async (request: Request, response: Response) => {
  const { collaboratorFullName, collaboratorEmail } = request.body;

  try {
      const {fullName, email} = request.session;


      // Find the user (collaborator) by their email
      const connection = AppDataSource;
      const userRepository = connection.getRepository(Users);
      const collaborator = await userRepository.findOne({ where: { email: collaboratorEmail, full_name: collaboratorFullName } });

      if (!collaborator) {
          return response.status(404).json({ message: 'Collaborator not found' });
      }

      // Add the collaborator to the array
      collaboratorsArray.push({ full_name: collaboratorFullName, email: collaboratorEmail });

    response.render('create-project',{collaboratorFullName, collaboratorEmail, fullName, email,  collaboratorsArray})

      // response.status(201).json({ message: 'Collaborator created successfully'});
      //  response.status(200).json({ message: 'Collaborator added successfully' });
      } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'An error occurred while adding the collaborator' });
      }
}
    
        