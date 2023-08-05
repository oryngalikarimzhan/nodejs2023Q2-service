import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { FavoriteArtist } from './entities/favorite-artist.entity';
import { FavoriteAlbum } from './entities/favorite-album.entity';
import { FavoriteTrack } from './entities/favorite-track.entity';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
  imports: [
    TypeOrmModule.forFeature([FavoriteArtist, FavoriteAlbum, FavoriteTrack]),
  ],
})
export class FavoritesModule {}
