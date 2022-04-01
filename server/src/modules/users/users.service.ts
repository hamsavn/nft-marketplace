import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserInput: CreateUserInput) {
    return this.usersRepository.insert(createUserInput);
  }

  findOne(address: string) {
    return this.usersRepository.findOne(address);
  }

  countArtist() {
    return this.usersRepository.count({});
  }

  updateNonce(address: string, nonce: string) {
    return this.usersRepository.update(address, { nonce });
  }

  getTopSellers() {
    return this.usersRepository.find({
      order: {
        totalSales: 'DESC',
      },
      take: 12,
    });
  }

  async addTotalSales(address: string, amount: number) {
    const user = await this.findOne(address);
    await this.usersRepository.update(address, {
      totalSales: user.totalSales + amount,
    });
  }

  update(address: string, input: Omit<UpdateUserInput, 'profileImage'>, profileImage?: string) {
    return this.usersRepository.update(address, {
      ...input,
      ...(profileImage ? { profileImage } : {}),
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
