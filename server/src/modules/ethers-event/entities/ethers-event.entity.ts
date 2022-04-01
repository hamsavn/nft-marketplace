import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';

@Entity()
export class EthersEvent {
  @PrimaryColumn()
  @Generated('uuid')
  id?: string;

  @Column()
  transactionHash: string;
}
