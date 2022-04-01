import { Field, Float, InputType, Int } from '@nestjs/graphql';
@InputType()
export class CreateNFTInput {
  @Field(() => String)
  tokenURI: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  fileURL: string;

  @Field(() => String)
  status: string;

  @Field(() => String)
  addressCreator: string;

  @Field(() => String)
  addressOwner: string;

  @Field(() => Float)
  price?: number;

  @Field(() => Int)
  tokenId?: number;

  @Field(() => Int)
  mediaHeight?: number;

  @Field(() => Int)
  mediaWidth?: number;
}
