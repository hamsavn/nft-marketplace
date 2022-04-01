import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradingHistory } from './entities/trading-history.entity';
import { TradingHistoryResolver } from './trading-history.resolver';
import { TradingHistoryService } from './trading-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([TradingHistory])],
  providers: [TradingHistoryService, TradingHistoryResolver],
  exports: [TradingHistoryService, TradingHistoryModule],
})
export class TradingHistoryModule {}
