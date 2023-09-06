import { EntityRepository, Repository } from "typeorm";
import { Invitation } from "../modules/invitation-entity";

@EntityRepository(Invitation)
export class InvitationRepository extends Repository<Invitation> {
  static findUserByEmail: any;
  static findOne(arg0: {
      where: { // Save the invitation to the database
          email: any;
      };
  }) {
      throw new Error("Method not implemented.");
  }
  async inviteAndSave(email: string, full_name: string, defaultPassword: string): Promise<Invitation> {
    const invitation = new Invitation(email, full_name, defaultPassword);

    try {
      // Save the invitation to the database
      const savedInvitation = await this.save(invitation);
      return savedInvitation;
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<Invitation | null> {
    return this.findOne({ where: { email } });
  }

  // async findUserByEmail(email: string): Promise<Invitation | null> {
  //   try {
  //       const user = await this.findOne({ where: {  email } });
  //     return user || null;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}