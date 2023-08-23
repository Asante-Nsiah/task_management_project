// import { Entity, EntityRepository, Repository, getManager } from 'typeorm';
// import { Users } from '../modules/user-entity';
// import { Invitation, InvitationRepository } from '../repository/invitation-repository';

import { EntityRepository, Repository } from "typeorm";
import { Users } from "../modules/user-entity";


// export class UsersRepository extends Repository<Users> {
//   authenticateUser(email: any, password: any) {
//     throw new Error("Method not implemented.");
//   }
//   async inviteUserByAdmin(requesterEmail: string, email: string, fullName: string, defaultPassword: string): Promise<User> {
//     // Check if the requester is an admin (assuming an "isAdmin" attribute)
//     const requester = await this.findOne({ where: { email: requesterEmail } });
//     if (!requester || !requester.isAdmin) {
//       throw new Error('Only admin users can send invitations.');
//     }

//     // Create an invitation for the use
//     const entityManager = getManager();
//     const invitationRepository = entityManager.getCustomRepository(InvitationRepository);
//     const invitation = await invitationRepository.findOne({ where: { email } });

//     if (!invitation) {
//       throw new Error('Invitation not found.');
//     }

//     // Create a user with the invitation
//     const user = new Users();
//     user.email = email;
//     user.fullName = fullName;
//     user.password = defaultPassword;
//     await this.save(user);

//     return user;
//   }

  
// }
@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
  // ...

  // Custom repository method to create a new user
  async createUser(newUser: Partial<Users>): Promise<Users> {
    try {
      const user = this.create(newUser);
      return await this.save(user);
    } catch (error) {
      throw error;
    }
  }
}