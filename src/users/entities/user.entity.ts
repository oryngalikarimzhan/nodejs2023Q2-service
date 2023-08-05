import { IsString, IsUUID, Length } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

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
  @Exclude({ toPlainOnly: true })
  @ApiHideProperty()
  password: string;

  @VersionColumn()
  @ApiProperty({ example: 1 })
  version: number;

  @CreateDateColumn()
  @ApiProperty({ example: 1655000000, type: Number })
  @Transform(({ value }) => value.getTime(), { toPlainOnly: true })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: 1655000000, type: Number })
  @Transform(({ value }) => value.getTime(), { toPlainOnly: true })
  updatedAt: Date;
}
