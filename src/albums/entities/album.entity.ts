import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { v4 } from 'uuid';

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

  @IsUUID(4)
  @ValidateIf((_, value) => value !== null)
  @ApiProperty({ format: 'uuid' })
  artistId: string | null;

  constructor(name: string, year: number, artistId: string | null) {
    this.id = v4();
    this.name = name;
    this.year = year;
    this.artistId = artistId;
  }
}
