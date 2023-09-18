import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Users } from "../modules/user-entity";
import { AppDataSource } from "../route/data-source";
import { logger } from "../route/logger";


const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

export const collaboratorsArray: Array<{ full_name: string; email: string }> = [];

export const collaborators = async (request: Request, response: Response) => {
  const { full_name, email, collaboratorFullName, collaboratorEmail } = request.body;

  try {
    let userFullName = full_name;
    let userEmail = email;



      // const user = await AppDataSource
      //     .getRepository(Users)
      //     .createQueryBuilder()
      //     .where("email = :email", { email })
      //     .getOne();

      // if (!user) {
      //     const message = `Login denied.`;
      //     logger.info(`${message} - ${email}`);
      //     response.status(403).json({ message });
      //     return;
      // }

      // Find the user (collaborator) by their email
      const connection = AppDataSource;
      const userRepository = connection.getRepository(Users);
      const collaborator = await userRepository.findOne({ where: { email: collaboratorEmail, full_name: collaboratorFullName } });

      if (!collaborator) {
          return response.status(404).json({ message: 'Collaborator not found' });
      }

      // Add the collaborator to the array
      collaboratorsArray.push({ full_name: collaboratorFullName, email: collaboratorEmail });

      // const { isAdmin } = user;
      // const authJwt = {
      //     userId: user.id,
      //     email,
      //     isAdmin,
      // };

      // const authJwtToken = await jwt.sign(authJwt, JWT_SECRET);
      // console.log(authJwtToken);

      // request.headers.authorization = `Bearer ${authJwtToken}`;

      response.render('create-project', {userFullName, userEmail,collaboratorFullName, collaboratorEmail, collaboratorsArray });
      //  response.status(200).json({ message: 'Collaborator added successfully' });
      } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'An error occurred while adding the collaborator' });
      }
}
    
        