import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import config from '@config/index';

const { music } = config.database.names;

@Entity({ database: music, name: 'songs' })
class Song {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  artist!: string;

  @Column()
  imageurl!: string;

  @Column()
  notes!: string;

  @Column({ type: 'int' })
  popularity!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

export { Song };
