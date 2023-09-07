import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Users } from "../modules/user-entity";

import { AppDataSource } from "../route/data-source";



export const collaboratorsArray: Array<{ full_name: string; email: string }> = [];

export const collaborators = async (request: Request, response: Response) => {
    const { collaboratorFullName,collaboratorEmail } = request.body;
    
    try {
        // Find the user (collaborator) by their email
        const connection = AppDataSource;
        const userRepository = connection.getRepository(Users);
        const collaborator = await userRepository.findOne({where: { email: collaboratorEmail } });
    
        if (!collaborator) {
          return response.status(404).json({ message: 'Collaborator not found' });
        }
        const collaboratorList = collaboratorsArray;
        // Add the collaborator to the array
        collaboratorsArray.push({ full_name: collaboratorFullName, email: collaboratorEmail });
        

        return response.redirect('/user-dashboard/create-project');
        // response.status(200).json({ message: 'Collaborator added successfully' });
        
        

      } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'An error occurred while adding the collaborator' });
      }
}
    
        