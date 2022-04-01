import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NftMintedResponse {
  @Field(() => String)
  nftMinted: string;

  @Field(() => String)
  nftId: string;
}
