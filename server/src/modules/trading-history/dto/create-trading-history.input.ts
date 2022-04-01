import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateTradingHistory {
  @Field(() => String)
  event: string;

  @Field(() => Int)
  price: number;

  @Field(() => String)
  from: string;

  @Field(() => String)
  to: string;

  @Field(() => String)
  nftId: string;
}
