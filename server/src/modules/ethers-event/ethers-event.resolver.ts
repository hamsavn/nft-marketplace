import { Resolver, Query, Args, Subscription, Mutation, ObjectType } from '@nestjs/graphql';
import { PUB_SUB } from '@modules/pub-sub/pub-sub.module';
import { Inject, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { GqlAuthGuardOptional } from '@modules/auth/gql-auth.guard';
import { NftMintedResponse } from './dto/nft-minted-response';
import { NftDelistingResponse } from './dto/nft-delisting-response';
import { NftSetTokenUriResponse } from './dto/nft-setTokenURI-response';
@Resolver()
export class EthersEventResolver {
  constructor(@Inject(PUB_SUB) private pubSub: PubSub) {}

  // @UseGuards(GqlAuthGuardOptional)
  @Subscription(() => NftMintedResponse)
  nftMinted() {
    return this.pubSub.asyncIterator('nftMinted');
  }
  @Subscription(() => NftDelistingResponse)
  nftDelisting() {
    return this.pubSub.asyncIterator('nftDelisting');
  }
  @Subscription(() => NftDelistingResponse)
  nftListing() {
    return this.pubSub.asyncIterator('nftListing');
  }
  @Subscription(() => NftDelistingResponse)
  nftBuying() {
    return this.pubSub.asyncIterator('nftBuying');
  }
  @Subscription(() => NftSetTokenUriResponse)
  nftSetTokenURI() {
    return this.pubSub.asyncIterator('nftSetTokenURI');
  }
}
