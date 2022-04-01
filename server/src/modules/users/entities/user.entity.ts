import { ObjectType, Field, HideField, Int, Float } from '@nestjs/graphql';
import { Entity, PrimaryColumn, CreateDateColumn, Column } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryColumn()
  @Field(() => String, { description: 'Wallet address' })
  address: string;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: string;

  @Column()
  @HideField()
  nonce: string;

  @Column({
    nullable: true,
  })
  email?: string;

  @Column({
    nullable: true,
  })
  bio?: string;

  @Column({
    nullable: true,
  })
  socialLink?: string;

  @Column({
    nullable: true,
  })
  userName?: string;

  @Column({
    nullable: true,
  })
  profileImage?: string;

  @Column({
    nullable: true,
  })
  profileBanner?: string;

  @Column({
    nullable: true,
  })
  twitterName?: string;

  @Column({
    nullable: true,
  })
  instaName?: string;

  @Column({ type: 'double precision', default: 0 })
  @Field(() => Float)
  totalSales: number;
}
