import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID, Length } from 'class-validator';
import { v4 } from 'uuid';

@Injectable()
export class Artist {
  @IsUUID(4)
  @ApiProperty({ format: 'uuid' })
  id: string;

  @IsString()
  @Length(2)
  @ApiProperty({ example: 'Freddie Mercury' })
  name: string;

  @IsBoolean()
  @ApiProperty({ example: false })
  grammy: boolean;

  constructor(name: string, grammy: boolean) {
    this.id = v4();
    this.name = name;
    this.grammy = grammy;
  }
}
