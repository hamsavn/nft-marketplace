import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTradingHistory } from './dto/create-trading-history.input';
import { TradingHistory } from './entities/trading-history.entity';

@Injectable()
export class TradingHistoryService {
  constructor(
    @InjectRepository(TradingHistory)
    private tradingHistoryRepository: Repository<TradingHistory>,
  ) {}

  create(input: CreateTradingHistory) {
    return this.tradingHistoryRepository.insert(input);
  }

  findByNft(nftId: string) {
    return this.tradingHistoryRepository.find({ nftId });
  }
}
