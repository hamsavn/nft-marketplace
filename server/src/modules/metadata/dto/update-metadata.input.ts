import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class UpdateMetadataInput {
  @Field(() => String)
  ipfsHash: string;

  @Field(() => GraphQLUpload)
  media?: FileUpload;

  @Field(() => String)
  title?: string;

  @Field(() => String)
  description?: string;
}
