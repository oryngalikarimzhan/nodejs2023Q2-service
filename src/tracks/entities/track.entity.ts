import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsUUID,
  Length,
  Min,
  ValidateIf,
} from 'class-validator';
import { v4 } from 'uuid';

export class Track {
  @IsUUID(4)
  @ApiProperty({ format: 'uuid' })
  id: string;

  @IsString()
  @Length(3)
  @ApiProperty({ example: 'The Show Must Go On' })
  name: string;

  @IsUUID(4)
  @ValidateIf((_, value) => value !== null)
  @ApiProperty({ format: 'uuid', nullable: true })
  artistId: string | null;

  @IsUUID(4)
  @ValidateIf((_, value) => value !== null)
  @ApiProperty({ format: 'uuid', nullable: true })
  albumId: string | null;

  @IsInt()
  @Min(1)
  @ApiProperty({ example: 262 })
  duration: number;

  constructor(
    name: string,
    albumId: string | null,
    artistId: string | null,
    duration: number,
  ) {
    this.id = v4();
    this.name = name;
    this.albumId = albumId;
    this.artistId = artistId;
    this.duration = duration;
  }
}
