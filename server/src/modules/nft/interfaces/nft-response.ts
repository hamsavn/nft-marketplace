import { Nft } from '../entities/nft.entity';
import { ObjectType, InputType, Field, Int } from '@nestjs/graphql';

@InputType()
class Pagination {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  perPage: number;
}

@InputType()
export class NftQueryParams {
  @Field(() => String, { nullable: true })
  creator?: string;

  @Field(() => String, { nullable: true })
  owner?: string;

  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => Pagination)
  pagination: Pagination;
}

@ObjectType()
export class NftResponse {
  @Field(() => Int)
  total: number;

  @Field(() => [Nft])
  items: Nft[];
}
