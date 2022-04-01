import { Field, Float, InputType, Int } from '@nestjs/graphql';
@InputType()
export class UpdateNFTInput {
  @Field(() => String)
  tokenURI: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  fileURL: string;

  @Field(() => String)
  addressOwner?: string;

  @Field(() => String)
  status: string;

  @Field(() => Int)
  tokenId?: number;

  @Field(() => Float)
  price?: number;

  @Field(() => Int)
  mediaHeight?: number;

  @Field(() => Int)
  mediaWidth?: number;
}
