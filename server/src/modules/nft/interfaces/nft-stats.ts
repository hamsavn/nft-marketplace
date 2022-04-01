import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class NftStats {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  totalArtist: number;
}
