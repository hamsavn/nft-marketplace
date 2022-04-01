import { Resolver, Query, Args, ResolveField, Parent, ResolveProperty } from '@nestjs/graphql';
import { NftService } from './nft.service';
import { Nft } from './entities/nft.entity';
import { UsersService } from '@modules/users/users.service';
import { User } from '@modules/users/entities/user.entity';
import { NftResponse, NftQueryParams } from './interfaces/nft-response';
import { NftStats } from './interfaces/nft-stats';
import { TradingHistory } from '@modules/trading-history/entities/trading-history.entity';
import { TradingHistoryService } from '@modules/trading-history/trading-history.service';

@Resolver(() => Nft)
export class NftResolver {
  constructor(
    private readonly nftService: NftService,
    private userService: UsersService,
    private tradingHistoryService: TradingHistoryService,
  ) {}

  @Query(() => Nft)
  async nftDetail(@Args({ name: 'id', type: () => String }) id: string) {
    let nftDetail = await this.nftService.findById(id);
    return nftDetail;
  }

  @Query(() => NftResponse)
  async nft(
    @Args({ name: 'input', type: () => NftQueryParams }) input: NftQueryParams,
  ): Promise<NftResponse> {
    return this.nftService.find(input);
  }

  @Query(() => [Nft])
  async newItems() {
    return this.nftService.getNewItems();
  }

  @Query(() => NftStats)
  async stats() {
    return this.nftService.getStats();
  }

  @ResolveField('owner', () => User)
  async getOwner(@Parent() item: Nft) {
    return this.userService.findOne(item.addressOwner);
  }

  @ResolveField('creator', () => User)
  async getCreator(@Parent() item: Nft) {
    return this.userService.findOne(item.addressCreator);
  }

  @ResolveField('tradingHistory', () => [TradingHistory!]!)
  async getTradingHistory(@Parent() item: Nft) {
    return this.tradingHistoryService.findByNft(item.id);
  }
}
