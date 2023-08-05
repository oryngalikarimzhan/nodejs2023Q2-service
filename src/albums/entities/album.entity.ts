import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
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

@Entity('album')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID(4)
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Innuendo' })
  name: string;

  @Column()
  @IsInt()
  @Max(new Date().getFullYear())
  @ApiProperty({ example: 2020 })
  year: number;

  @Column({ name: 'artist_id', default: null, type: 'uuid', nullable: true })
  @IsUUID(4)
  @ValidateIf((_, value) => value !== null)
  @ApiProperty({ format: 'uuid' })
  artistId: string | null;

  @ManyToOne(() => Artist, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artist_id', referencedColumnName: 'id' })
  @Exclude()
  @ApiHideProperty()
  artist: Artist;
}
