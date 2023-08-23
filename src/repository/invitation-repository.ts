import { Entity, Repository } from 'typeorm';
import { Invitation } from '../modules/invitation-entity'; // Update the import path as needed


export class InvitationRepository extends Repository<Invitation> {
  static create() {
      throw new Error('Method not implemented.');
  }
    
  // Define custom methods specific to InvitationRepository here
  async findByEmail(email: string): Promise<Invitation | undefined> {
    const invitation = await this.findOne({ where: { email } });
    return invitation || undefined;
  }
}

export { Invitation };
