import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/users.entity'

@Entity()
export class Bets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bet_option: number;

  @Column({ type: 'varchar', length: 255 })
  sport: string;

  @Column({ type: 'varchar', length: 255 })
  status: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column()
  event_id: number;

  @Column({ type: 'integer' })
  odd: number;

  @Column({ type: 'varchar', length: 255, default: null })
  result: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'integer', default: 1 })
  deleted: number;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;
}