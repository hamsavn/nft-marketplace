import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Metadata, UploadService } from '@modules/upload/upload.service';
import { CreateMetadataInput } from './dto/create-metadata.input';
import { UpdateMetadataInput } from './dto/update-metadata.input';
import { User } from '@modules/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@modules/auth/gql-auth.guard';
import { CurrentUser } from '@modules/utils/current-user';
import { NftService } from '@modules/nft/nft.service';
import { NftStatus } from '@modules/utils/contstant';
import { FileUpload } from 'graphql-upload';
import { MetadataService } from './metadata.service';

@Resolver()
export class MetadaResolver {
  constructor(
    private uploadService: UploadService,
    private nftService: NftService,
    private metadataService: MetadataService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async createMetadata(
    @CurrentUser() user: User,
    @Args({ name: 'input', type: () => CreateMetadataInput })
    input: CreateMetadataInput,
  ): Promise<string> {
    const fileName = await this.uploadService.uploadFile(input.media);
    const imageSize = await this.uploadService.getImageSize(fileName);
    const data = await this.uploadService.pinToPinata(fileName, input);

    await this.nftService.create({
      title: input.title,
      description: input.description,
      status: NftStatus.draft,
      fileURL: fileName,
      tokenURI: data.hash,
      addressCreator: user.address,
      addressOwner: user.address,
      price: 0,
      tokenId: 0,
      mediaHeight: imageSize.height,
      mediaWidth: imageSize.width,
    });

    return data.hash;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async updateMetadata(
    @CurrentUser() user: User,
    @Args({ name: 'input', type: () => UpdateMetadataInput }) updateInput: UpdateMetadataInput,
  ) {
    const metadataCID = updateInput.ipfsHash;

    if (updateInput.media) {
      const { imageUrl, filename } = await this.uploadService.pinImage(
        updateInput.media as FileUpload,
      );
      const imageSize = await this.uploadService.getImageSize(filename);

      const metadata: Metadata = {
        name: updateInput.title,
        keyvalues: {
          name: updateInput.title,
          description: updateInput.description,
          image: imageUrl,
        },
      };

      await this.metadataService.create({
        hostedFile: filename,
        pinataUrl: imageUrl,
        height: imageSize.height,
        width: imageSize.width,
      });

      const { IpfsHash } = await this.uploadService.pinMetadata(metadata);

      return IpfsHash;
    } else {
      const currentMetadata = await this.uploadService.queryMetadata(metadataCID);
      const imageUrl = currentMetadata.keyvalues.image;

      const metadata: Metadata = {
        name: updateInput.title,
        keyvalues: {
          name: updateInput.title,
          description: updateInput.description,
          image: imageUrl,
        },
      };

      const { IpfsHash } = await this.uploadService.pinMetadata(metadata);

      return IpfsHash;
    }
  }
}
