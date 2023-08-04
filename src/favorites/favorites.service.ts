import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';

import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';

@Injectable()
export class FavoritesService {
  favorites: {
    artistsIds: Set<string>;
    albumsIds: Set<string>;
    tracksIds: Set<string>;
  } = {
    artistsIds: new Set(),
    albumsIds: new Set(),
    tracksIds: new Set(),
  };

  constructor(
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
  ) {}

  async findAll() {
    return {
      artists: await this.artistsService.findArtistsByIds([
        ...this.favorites.artistsIds,
      ]),
      albums: this.albumsService.findAlbumsByIds([...this.favorites.albumsIds]),
      tracks: this.tracksService.findTracksByIds([...this.favorites.tracksIds]),
    };
  }

  addTrack(id: string) {
    try {
      this.tracksService.findOne(id);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          null,
          'track with this id does not exists',
        );
      }

      throw e;
    }

    return this.favorites.tracksIds.add(id);
  }

  deleteTrack(id: string) {
    if (!this.isTrackExists(id)) {
      throw new NotFoundException();
    }

    return this.favorites.tracksIds.delete(id);
  }

  addAlbum(id: string) {
    try {
      this.albumsService.findOne(id);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          null,
          'album with this id does not exists',
        );
      }

      throw e;
    }

    return this.favorites.albumsIds.add(id);
  }

  deleteAlbum(id: string) {
    if (!this.isAlbumExists(id)) {
      throw new NotFoundException();
    }

    return this.favorites.albumsIds.delete(id);
  }

  async addArtist(id: string) {
    try {
      await this.artistsService.findOne(id);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          'artist with this id does not exists',
        );
      }

      throw e;
    }

    return this.favorites.artistsIds.add(id);
  }

  deleteArtist(id: string) {
    if (!this.isArtistExists(id)) {
      throw new NotFoundException();
    }

    return this.favorites.artistsIds.delete(id);
  }

  isArtistExists(artistId: string) {
    return this.favorites.artistsIds.has(artistId);
  }

  isAlbumExists(albumId: string) {
    return this.favorites.albumsIds.has(albumId);
  }

  isTrackExists(trackId: string) {
    return this.favorites.tracksIds.has(trackId);
  }
}
