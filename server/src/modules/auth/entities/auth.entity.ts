import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Auth {
  @Field(() => String)
  token: string;
}
