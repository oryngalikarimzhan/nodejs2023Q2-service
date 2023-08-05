import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Artist } from '../../artists/entities/artist.entity';
import { Album } from '../../albums/entities/album.entity';

@Entity('track')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID(4)
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'The Show Must Go On' })
  name: string;

  @Column({ name: 'artist_id', default: null, type: 'uuid', nullable: true })
  @IsUUID(4)
  @ValidateIf((_, value) => value !== null)
  @ApiProperty({ format: 'uuid', nullable: true })
  artistId: string | null;

  @Column({ name: 'album_id', default: null, type: 'uuid', nullable: true })
  @IsUUID(4)
  @ValidateIf((_, value) => value !== null)
  @ApiProperty({ format: 'uuid', nullable: true })
  albumId: string | null;

  @Column()
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 262 })
  duration: number;

  @ManyToOne(() => Artist, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artist_id', referencedColumnName: 'id' })
  artist: Artist;

  @ManyToOne(() => Album, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'album_id', referencedColumnName: 'id' })
  album: Album;
}
