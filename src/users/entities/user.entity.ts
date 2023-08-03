import {
  IsInt,
  IsString,
  IsUUID,
  Length,
  Min,
  Validate,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { TimestampValidator } from '../users.utils';
import { DateToTimestampTransformer } from '../../app.utils';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID(4)
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Column({ unique: true })
  @Length(3)
  @IsString()
  @ApiProperty({ example: 'TestUser' })
  login: string;

  @Column()
  @IsString()
  @Length(5)
  @Exclude()
  password: string;

  @VersionColumn()
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1 })
  version: number;

  @CreateDateColumn({ transformer: new DateToTimestampTransformer() })
  @IsInt()
  @Validate(TimestampValidator)
  @ApiProperty({ example: 1655000000 })
  createdAt: number;

  @UpdateDateColumn({ transformer: new DateToTimestampTransformer() })
  @IsInt()
  @Validate(TimestampValidator)
  @ApiProperty({ example: 1655000000 })
  updatedAt: number;
}
