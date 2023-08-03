import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class ArtistsService {
  artists: Record<string, Artist> = {};

  constructor(
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  findAll() {
    return Object.keys(this.artists).map((artistId) => this.artists[artistId]);
  }

  findOne(artistId: string) {
    const artist = this.artists[artistId];

    if (!artist) {
      throw new NotFoundException();
    }

    return artist;
  }

  create({ name, grammy }: CreateArtistDto) {
    const artist = new Artist(name, grammy);
    this.artists[artist.id] = artist;

    return artist;
  }

  update(artistId: string, updateArtistDto: UpdateArtistDto) {
    const hasProperties = Object.keys(updateArtistDto).length > 0;

    if (!hasProperties) {
      throw new BadRequestException(null, 'Body is empty');
    }

    const artist = this.findOne(artistId);

    const updatedArtist = { ...artist, ...updateArtistDto };
    this.artists[artistId] = updatedArtist;

    return updatedArtist;
  }

  remove(artistId: string) {
    const album = this.albumsService.findAlbumByArtistId(artistId);
    const track = this.tracksService.findTrackByArtistId(artistId);

    if (album) {
      this.albumsService.update(album.id, { artistId: null });
    }

    if (track) {
      this.tracksService.update(track.id, { artistId: null });
    }

    if (this.favoritesService.isArtistExists(artistId)) {
      this.favoritesService.deleteArtist(artistId);
    }

    const artist = this.findOne(artistId);

    delete this.artists[artist.id];

    return;
  }

  findArtistsByIds(artistsIds: string[]) {
    return artistsIds.map((id) => this.artists[id]);
  }
}
