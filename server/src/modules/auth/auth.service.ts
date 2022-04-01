import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '@modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthInput } from '@modules/auth/dto/create-auth.input';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { User } from '@modules/users/entities/user.entity';
import { Payload } from '@modules/auth/interfaces/payload.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async create(createAuthInput: CreateAuthInput) {
    const user = await this.usersService.findOne(createAuthInput.address);

    const recoveredAddress = recoverPersonalSignature({
      data: AuthService.getAuthMessage(user.nonce),
      signature: createAuthInput.signature,
    });

    if (recoveredAddress !== user.address) throw new ForbiddenException();

    const token = this.createToken(user);
    await this.usersService.updateNonce(user.address, AuthService.createNonce());

    return { token };
  }

  private createToken(user: User) {
    const payload: Payload = { address: user.address, sub: user.address };

    return this.jwtService.sign(payload);
  }

  static getAuthMessage(nonce: string) {
    return `
   Well come to my first dApp

   Nonce: ${nonce}
 `;
  }

  static createNonce(): string {
    return uuidv4();
  }

  async getAuthMessageByUser(address: string): Promise<string> {
    const user = await this.usersService.findOne(address);

    if (user) {
      return AuthService.getAuthMessage(user.nonce);
    }

    // Create a new user and assign none if user's not exist
    const nonce = AuthService.createNonce();
    await this.usersService.create({
      address,
      nonce,
    });

    return AuthService.getAuthMessage(nonce);
  }
}
