import { Field, InputType } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
@InputType()
export class CreateMetadataInput {
  @Field(() => GraphQLUpload)
  media: FileUpload;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;
}
