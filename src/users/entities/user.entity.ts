import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
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

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID(4)
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'TestUser' })
  login: string;

  @Column()
  @Exclude()
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

  @Column({ nullable: true, default: null })
  @Exclude()
  refreshToken: string | null;
}
