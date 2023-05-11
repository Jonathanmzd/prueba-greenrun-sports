import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import { User } from './users.entity';
import { Bets } from './bets.entity';


@Entity()
export class Bet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  bets_id: number;

  @Column()
  odd: number;

  @Column()
  amount: number;

  @Column({ type: 'varchar', length: 255 })
  state: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'integer', default:1 })
  deleted: number;

  @DeleteDateColumn({ type: 'timestamp' })
  delete_at: Date;

  @ManyToMany(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Bets, (bets) => bets.id, { nullable: true })
  @JoinColumn({ name: 'bets_id' })
  bets: Bets;
}