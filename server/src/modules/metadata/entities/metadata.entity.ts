import { Field, ObjectType, Int } from '@nestjs/graphql';
import {
  Entity,
  Generated,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity('metadata')
@ObjectType()
export class Metadata {
  @PrimaryColumn()
  @Generated('uuid')
  @Field(() => String)
  id: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: string;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: string;

  @Column()
  @Field(() => String)
  pinataUrl: string;

  @Column()
  @Field(() => String)
  hostedFile: string;

  @Column()
  @Field(() => Int)
  height: number;

  @Column()
  @Field(() => Int)
  width: number;
}
