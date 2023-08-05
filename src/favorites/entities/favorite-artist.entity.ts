import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Artist } from '../../artists/entities/artist.entity';

@Entity('favorite_artist')
export class FavoriteArtist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'artist_id' })
  artistId: string;

  @OneToOne(() => Artist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;
}
