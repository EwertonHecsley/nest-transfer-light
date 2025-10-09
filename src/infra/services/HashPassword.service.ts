import { HashPasswordGateway } from 'core/domain/ports/HashPasswordGateway';
import bcrypt from 'bcrypt';

export class HashPasswordService implements HashPasswordGateway {
  private readonly saltRounds: number = 10;

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(passwod: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(passwod, hash);
  }
}
