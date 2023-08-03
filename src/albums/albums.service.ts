import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';
import { ArtistsService } from '../artists/artists.service';

@Injectable()
export class AlbumsService {
  albums: Record<string, Album> = {};

  constructor(
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  findAll() {
    return Object.keys(this.albums).map((albumId) => this.albums[albumId]);
  }

  findOne(albumId: string) {
    const album = this.albums[albumId];

    if (!album) {
      throw new NotFoundException();
    }

    return album;
  }

  create({ name, year, artistId }: CreateAlbumDto) {
    if (artistId) {
      this.artistsService.findOne(artistId);
    }

    const album = new Album(name, year, artistId);
    this.albums[album.id] = album;

    return album;
  }

  update(albumId: string, updateAlbumDto: UpdateAlbumDto) {
    const artistId = updateAlbumDto?.artistId;

    if (artistId) {
      this.artistsService.findOne(artistId);
    }

    const hasProperties = Object.keys(updateAlbumDto).length > 0;

    if (!hasProperties) {
      throw new BadRequestException(null, 'Body is empty');
    }

    const album = this.findOne(albumId);

    const updatedAlbum = { ...album, ...updateAlbumDto };
    this.albums[albumId] = updatedAlbum;

    return updatedAlbum;
  }

  remove(albumId: string) {
    const album = this.favoritesService.isAlbumExists(albumId);
    const track = this.tracksService.findTrackByAlbumId(albumId);

    if (album) {
      this.favoritesService.deleteAlbum(albumId);
    }

    if (track) {
      this.tracksService.update(track.id, { albumId: null });
    }

    this.findOne(albumId);

    delete this.albums[albumId];

    return;
  }

  findAlbumByArtistId(artistId: string) {
    const albumId = Object.keys(this.albums).find(
      (id) => this.albums[id].artistId === artistId,
    );

    return this.albums[albumId];
  }

  findAlbumsByIds(albumsIds: string[]) {
    return albumsIds.map((id) => this.albums[id]);
  }
}
