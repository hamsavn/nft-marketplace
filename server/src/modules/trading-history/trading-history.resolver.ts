import { Args, Query, Resolver } from '@nestjs/graphql';
import { TradingHistory } from './entities/trading-history.entity';
import { TradingHistoryService } from './trading-history.service';

@Resolver(() => TradingHistory)
export class TradingHistoryResolver {
  constructor(private tradingHistoryService: TradingHistoryService) {}
}
