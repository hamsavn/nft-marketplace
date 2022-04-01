import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EthersEvent } from './entities/ethers-event.entity';

@Injectable()
export class EthersEventService {
  constructor(
    @InjectRepository(EthersEvent) private ethersEventRepository: Repository<EthersEvent>,
  ) {}

  create(input: EthersEvent) {
    return this.ethersEventRepository.insert(input);
  }

  findOne(transactionHash: string) {
    return this.ethersEventRepository.findOne({ transactionHash });
  }
}
