import { NftService } from '@modules/nft/nft.service';
import { Inject, Module } from '@nestjs/common';
import { ethers } from 'ethers';
import nftABI from './nft-contract-info';
import marketplaceABI from './marketplace-contract-info';
import { PUB_SUB } from '@modules/pub-sub/pub-sub.module';
import { PubSub } from 'graphql-subscriptions';
import { NftModule } from '@modules/nft/nft.module';
import { EthersEventResolver } from '@modules/ethers-event/ethers-event.resolver';
import { NftMintedResponse } from './dto/nft-minted-response';
import { NftDelistingResponse } from './dto/nft-delisting-response';
import { TradingHistoryModule } from '@modules/trading-history/trading-history.module';
import { TradingHistoryService } from '@modules/trading-history/trading-history.service';
import { CreateTradingHistory } from '@modules/trading-history/dto/create-trading-history.input';
import { UploadService } from '@modules/upload/upload.service';
import { UploadModule } from '@modules/upload/upload.module';
import { NftStatus } from '@modules/utils/contstant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EthersEvent } from '@modules/ethers-event/entities/ethers-event.entity';
import { EthersEventService } from './ethers-event.service';
import { MetadataModule } from '@modules/metadata/metadata.module';
import { MetadataService } from '@modules/metadata/metadata.service';
import { UsersModule } from '@modules/users/users.module';
import { UsersService } from '@modules/users/users.service';

@Module({
  imports: [
    NftModule,
    TradingHistoryModule,
    UploadModule,
    TypeOrmModule.forFeature([EthersEvent]),
    MetadataModule,
    UsersModule,
  ],
  providers: [EthersEventResolver, EthersEventService],
})
export class EthersEventModule {
  constructor(
    private nftService: NftService,
    @Inject(PUB_SUB) private pubSub: PubSub,
    private tradingService: TradingHistoryService,
    private uploadService: UploadService,
    private ethersEventService: EthersEventService,
    private metadataService: MetadataService,
    private userService: UsersService,
  ) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_API_URL);
    const nftContract = new ethers.Contract(process.env.NFT_CONTRACT_ADDRESS, nftABI.abi, provider);
    const marketContract = new ethers.Contract(
      process.env.MARKETPLACE_CONTRACT_ADDRESS,
      nftABI.abi,
      provider,
    );
    const ifaceNft = new ethers.utils.Interface(nftABI.abi);
    const ifaceMarketplace = new ethers.utils.Interface(marketplaceABI.abi);
    const nftFilter = {
      address: process.env.NFT_CONTRACT_ADDRESS,
    };

    const marketplaceFilter = {
      address: process.env.MARKETPLACE_CONTRACT_ADDRESS,
    };

    provider.on(nftFilter, async (log, event) => {
      try {
        const logData = ifaceNft.parseLog(log);
        const ethersEvent: EthersEvent = {
          transactionHash: log.transactionHash,
        };
        const checkDupplicateEvent = await this.checkDupplicateEvent(log.transactionHash);
        if (checkDupplicateEvent) {
          return;
        }

        if (logData.name === 'NFTMinted') {
          const tokenId = ethers.BigNumber.from(logData.args.tokenId).toNumber();
          const tokenUri = await nftContract.tokenURI(tokenId);

          const draftNFT = await this.nftService.findOne(tokenUri);

          if (draftNFT.status === NftStatus.draft) {
            await this.nftService.update(draftNFT.id, { ...draftNFT, status: 'minted', tokenId });
          }

          const response: NftMintedResponse = {
            nftId: draftNFT.id,
            nftMinted: log.transactionHash,
          };

          this.pubSub.publish('nftMinted', { nftMinted: response });

          const tradingHistory: CreateTradingHistory = {
            event: NftStatus.minted,
            nftId: draftNFT.id,
            from: draftNFT.addressCreator,
            to: draftNFT.addressOwner,
            price: draftNFT.price,
          };
          await this.tradingService.create(tradingHistory);
        }

        if (logData.name === 'TokenURISet') {
          const tokenId = ethers.BigNumber.from(logData.args.tokenId).toNumber();
          const tokenURI = await nftContract.tokenURI(tokenId);

          const nft = await this.nftService.findByTokenId(tokenId);
          const metadata = await this.uploadService.queryMetadata(tokenURI);
          const fileMapping = await this.metadataService.findOne(metadata.keyvalues.image);

          await this.nftService.update(nft.id, {
            ...nft,
            tokenURI,
            title: metadata.keyvalues.name,
            description: metadata.keyvalues.description,
            fileURL: fileMapping?.hostedFile || nft.fileURL,
            mediaHeight: fileMapping?.height || nft.mediaHeight,
            mediaWidth: fileMapping?.width || nft.mediaWidth,
          });

          this.pubSub.publish('nftSetTokenURI', { nftSetTokenURI: { nftId: nft.id, tokenURI } });
        }

        await this.ethersEventService.create(ethersEvent);
      } catch (error) {
        console.log(error);
      }
    });

    provider.on(marketplaceFilter, async (log, event) => {
      try {
        const logData = ifaceMarketplace.parseLog(log);
        const ethersEvent: EthersEvent = {
          transactionHash: log.transactionHash,
        };

        const checkDupplicateEvent = await this.checkDupplicateEvent(log.transactionHash);

        if (checkDupplicateEvent) {
          return;
        }

        if (logData.name === 'OrderAdded') {
          const tokenId = ethers.BigNumber.from(logData.args.tokenId).toNumber();

          const priceInWei = logData.args.price;
          const priceInEther = Number(ethers.utils.formatEther(priceInWei));

          const draftNFT = await this.nftService.findByTokenId(tokenId);
          await this.nftService.update(draftNFT.id, {
            ...draftNFT,
            status: NftStatus.listing,
            price: priceInEther,
          });
          const response: NftDelistingResponse = {
            hashTransaction: log.transactionHash,
          };

          this.pubSub.publish('nftListing', { nftListing: response });

          const tradingHistory: CreateTradingHistory = {
            event: NftStatus.listing,
            nftId: draftNFT.id,
            from: draftNFT.addressCreator,
            to: draftNFT.addressOwner,
            price: priceInEther,
          };
          await this.tradingService.create(tradingHistory);
        }

        if (logData.name === 'OrderCancelled') {
          const tokenId = ethers.BigNumber.from(logData.args.tokenId).toNumber();
          const draftNFT = await this.nftService.findByTokenId(tokenId);

          await this.nftService.update(draftNFT.id, { ...draftNFT, status: NftStatus.minted });

          const response: NftDelistingResponse = {
            hashTransaction: log.transactionHash,
          };

          this.pubSub.publish('nftDelisting', { nftDelisting: response });

          const tradingHistory: CreateTradingHistory = {
            event: 'delisting',
            nftId: draftNFT.id,
            from: draftNFT.addressCreator,
            to: draftNFT.addressOwner,
            price: draftNFT.price,
          };

          await this.tradingService.create(tradingHistory);
        }

        if (logData.name === 'OrderExecuted') {
          const tokenId = ethers.BigNumber.from(logData.args.tokenId).toNumber();
          const buyer = logData.args.buyer;
          const seller = logData.args.seller;
          const draftNFT = await this.nftService.findByTokenId(tokenId);

          await this.nftService.update(draftNFT.id, {
            ...draftNFT,
            status: NftStatus.minted,
            addressOwner: (buyer as string).toLowerCase(),
            price: 0,
          });

          const response: NftDelistingResponse = {
            hashTransaction: log.transactionHash,
          };

          this.pubSub.publish('nftBuying', { nftBuying: response });

          const tradingHistory: CreateTradingHistory = {
            event: 'buying',
            nftId: draftNFT.id,
            from: seller,
            to: buyer,
            price: draftNFT.price,
          };

          await this.tradingService.create(tradingHistory);
          await this.userService.addTotalSales(seller.toLowerCase(), draftNFT.price);
        }

        await this.ethersEventService.create(ethersEvent);
      } catch (error) {
        console.log(error);
      }
    });
  }

  checkDupplicateEvent(transactionHash: string) {
    return this.ethersEventService.findOne(transactionHash);
  }
}
