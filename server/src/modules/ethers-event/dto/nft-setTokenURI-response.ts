import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NftSetTokenUriResponse {
  @Field(() => String)
  nftId: string;

  @Field(() => String)
  tokenURI: string;
}
