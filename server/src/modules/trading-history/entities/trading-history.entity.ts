import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, Generated, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class TradingHistory {
  @Field(() => String)
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Field(() => String)
  @Column()
  event: string;

  @Field(() => Float)
  @Column({ type: 'double precision' })
  price: number;

  @Field(() => String)
  @Column()
  from: string;

  @Field(() => String)
  @Column()
  to: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: string;

  @Field(() => String)
  @Column()
  nftId: string;
}
