import { Module } from '@nestjs/common';

import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { ArtistsModule } from '../artists/artists.module';
import { AlbumsModule } from '../albums/albums.module';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  imports: [AlbumsModule, TracksModule, ArtistsModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
