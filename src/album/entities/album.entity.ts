import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID, Length, Max, Min } from 'class-validator';
import { v4 } from 'uuid';

@Injectable()
export class Album {
  @IsUUID(4)
  @ApiProperty({ format: 'uuid' })
  id: string;

  @IsString()
  @Length(2)
  @ApiProperty({ example: 'Innuendo' })
  name: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  @ApiProperty({ example: 2020 })
  year: number;

  @IsString()
  @ApiProperty({ format: 'uuid' })
  artistId: string | null;

  constructor(name: string, year: number, artistId: string | null) {
    this.id = v4();
    this.name = name;
    this.year = year;
    this.artistId = artistId;
  }
}
