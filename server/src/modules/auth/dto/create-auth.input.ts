import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAuthInput {
  @Field(() => String)
  address: string;

  @Field(() => String)
  signature: string;
}
