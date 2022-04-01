import { Module } from '@nestjs/common';
import { NftService } from './nft.service';
import { NftResolver } from './nft.resolver';
import { UsersModule } from '@modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nft } from './entities/nft.entity';
import { TradingHistoryService } from '@modules/trading-history/trading-history.service';
import { TradingHistoryModule } from '@modules/trading-history/trading-history.module';

@Module({
  imports: [TypeOrmModule.forFeature([Nft]), UsersModule, TradingHistoryModule],
  providers: [NftResolver, NftService],
  exports: [NftService],
})
export class NftModule {}
