
import { EntityRepository, Repository } from "typeorm";
import { Users } from "../modules/user-entity";
import bcrypt from 'bcrypt';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
    static save // Find the user by email
        (user: Users) {
            throw new Error('Method not implemented.');
    }
    static updatePassword: any;
    static findOne(arg0: { where: { email: string; }; }) {
        throw new Error("Method not implemented.");
    }

  // Custom repository method to create a new user
  async createUser(newUser: Partial<Users>): Promise<Users> {
    try {
      const user = this.create(newUser);
      return await this.save(user);
    } catch (error) {
      throw error;
    }
  }

   async findUserById(userId: number): Promise<Users | null> {
      try {
        const user = await this.findOne({ where: { id: userId } }); 
        return user || null;
      } catch (error) {
        throw error;
      }
    }


    async findUserByEmail(email: string): Promise<Users | null> {
        try {
            const user = await this.findOne({ where: {  email } });
          return user || null;
        } catch (error) {
          throw error;
        }
      }

      async updatePassword(email: string, newPassword: string): Promise<void> {
        // Find the user by email
        const user = await this.findOne({ where: { email } });
    
        if (!user) {
          throw new Error('User not found');
        }
    
        // Update the user's password with the new hashed password
        user.password = newPassword;
    
        // Save the updated user entity
        await this.save(user);
      }

    
}

