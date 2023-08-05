import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Album } from '../../albums/entities/album.entity';

@Entity('favorite_album')
export class FavoriteAlbum {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'album_id' })
  albumId: string;

  @OneToOne(() => Album, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'album_id' })
  album: Album;
}
