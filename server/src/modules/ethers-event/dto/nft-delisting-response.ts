import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NftDelistingResponse {
  @Field(() => String)
  hashTransaction;
}
