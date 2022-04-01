import { Injectable } from '@nestjs/common';
import { Repository, ILike, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Nft } from './entities/nft.entity';
import { CreateNFTInput } from './dto/create-nft.input';
import { UpdateNFTInput } from './dto/update-nft.input';
import { NftResponse, NftQueryParams } from './interfaces/nft-response';
import { UsersService } from '@modules/users/users.service';
import { NftStats } from './interfaces/nft-stats';
import { NftStatus } from '@modules/utils/contstant';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(Nft)
    private nftRepository: Repository<Nft>,
    private userService: UsersService,
  ) {}

  create(input: CreateNFTInput) {
    return this.nftRepository.insert(input);
  }

  findOne(tokenURI: string) {
    return this.nftRepository.findOne({ tokenURI });
  }

  async getStats(): Promise<NftStats> {
    const total = await this.nftRepository.count({ where: { status: NftStatus.listing } });
    const totalArtist = await this.userService.countArtist();

    return {
      total,
      totalArtist,
    };
  }

  getNewItems() {
    return this.nftRepository.find({
      order: {
        createdAt: 'DESC',
      },
      where: { status: NftStatus.listing },
      take: 8,
    });
  }

  findById(id: string) {
    return this.nftRepository.findOne({ id });
  }

  async find(input: NftQueryParams): Promise<NftResponse> {
    const [result, total] = await this.nftRepository.findAndCount({
      take: input.pagination.perPage,
      skip: input.pagination.perPage * (input.pagination.page - 1),
      where: input.search
        ? [
            { title: ILike(`%${input.search}%`), status: NftStatus.listing },
            { description: ILike(`%${input.search}%`), status: NftStatus.listing },
          ]
        : {
            ...(input.owner ? { addressOwner: input.owner } : {}),
            ...(input.creator ? { addressCreator: input.creator } : {}),
            status:
              input.owner || input.creator
                ? In([NftStatus.listing, NftStatus.minted])
                : NftStatus.listing,
          },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      total,
      items: result,
    };
  }

  findByTokenId(tokenId: number) {
    return this.nftRepository.findOne({ tokenId });
  }

  update(nftID: string, input: UpdateNFTInput) {
    const { tokenURI, title, status, fileURL, description, price, tokenId, addressOwner } = input;

    return this.nftRepository.update(
      { id: nftID },
      { tokenURI, title, status, fileURL, description, price, tokenId, addressOwner },
    );
  }
}
