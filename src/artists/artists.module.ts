import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { FavoritesModule } from '../favorites/favorites.module';
import { TracksModule } from '../tracks/tracks.module';
import { Artist } from './entities/artist.entity';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService],
  imports: [
    TypeOrmModule.forFeature([Artist]),
    forwardRef(() => TracksModule),
    forwardRef(() => FavoritesModule),
  ],
})
export class ArtistsModule {}
