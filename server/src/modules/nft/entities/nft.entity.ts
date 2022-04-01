import { TradingHistory } from '@modules/trading-history/entities/trading-history.entity';
import { User } from '@modules/users/entities/user.entity';
import { Field, ObjectType, HideField, Float, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('nft')
@ObjectType()
export class Nft {
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

  @Column({ unique: true })
  @Field(() => String)
  tokenURI: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => String)
  fileURL: string;

  @Column()
  @Field(() => String)
  status: string;

  @Field(() => User)
  creator: User;

  @Field(() => User)
  owner: User;

  @Field(() => [TradingHistory])
  tradingHistory: TradingHistory[];

  @Column()
  @ManyToOne((type) => User, (user) => user.userName)
  @JoinColumn({ name: 'addressCreator', referencedColumnName: 'address' })
  @HideField()
  addressCreator?: string;

  @Column()
  @ManyToOne((type) => User, (user) => user.userName)
  @JoinColumn({ name: 'addressOwner', referencedColumnName: 'address' })
  @HideField()
  addressOwner?: string;

  @Column({ type: 'double precision' })
  @Field(() => Float)
  price?: number;

  @Column()
  @Field(() => Int)
  tokenId?: number;

  @Column({ default: 0 })
  @Field(() => Int)
  views: number;

  @Column({ default: 0 })
  @Field(() => Int)
  mediaHeight: number;

  @Column({ default: 0 })
  @Field(() => Int)
  mediaWidth: number;
}
