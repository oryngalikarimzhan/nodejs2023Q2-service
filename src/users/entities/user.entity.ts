import {
  IsInt,
  IsString,
  IsUUID,
  Length,
  Min,
  Validate,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { v4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

import { TimestampValidator } from '../users.utils';

export class User {
  @IsUUID(4)
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Length(3)
  @IsString()
  @ApiProperty({ example: 'TestUser' })
  login: string;

  @IsString()
  @Length(5)
  @Exclude()
  password: string;

  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1 })
  version: number;

  @IsInt()
  @Validate(TimestampValidator)
  @ApiProperty({ example: 1655000000 })
  createdAt: number;

  @IsInt()
  @Validate(TimestampValidator)
  @ApiProperty({ example: 1655000000 })
  updatedAt: number;

  constructor(login: string, password: string) {
    this.id = v4();
    this.login = login;
    this.password = password;
    this.version = 1;
    const now = Date.now();
    this.createdAt = now;
    this.updatedAt = now;
  }
}
