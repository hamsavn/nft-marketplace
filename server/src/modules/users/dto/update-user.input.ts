import { InputType, Field, Int } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class UpdateUserInput {
  email?: string;

  bio?: string;

  socialLink?: string;

  userName?: string;

  @Field(() => GraphQLUpload)
  profileImage?: FileUpload;

  profileBanner?: string;

  twitterName?: string;

  instaName?: string;
}
