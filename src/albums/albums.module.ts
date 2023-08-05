import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { FavoritesModule } from '../favorites/favorites.module';
import { TracksModule } from '../tracks/tracks.module';
import { Album } from './entities/album.entity';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
  imports: [
    TypeOrmModule.forFeature([Album]),
    forwardRef(() => FavoritesModule),
    forwardRef(() => TracksModule),
  ],
})
export class AlbumsModule {}
