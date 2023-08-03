import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TracksService {
  tracks: Record<string, Track> = {};

  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  findAll() {
    return Object.keys(this.tracks).map((trackId) => this.tracks[trackId]);
  }

  findOne(trackId: string) {
    const track = this.tracks[trackId];

    if (!track) {
      throw new NotFoundException();
    }

    return track;
  }

  create({ name, albumId, artistId, duration }: CreateTrackDto) {
    if (artistId) {
      this.artistsService.findOne(artistId);
    }
    if (albumId) {
      this.albumsService.findOne(albumId);
    }

    const track = new Track(name, albumId, artistId, duration);
    this.tracks[track.id] = track;

    return track;
  }

  update(trackId: string, updateTrackDto: UpdateTrackDto) {
    const { artistId, albumId } = updateTrackDto;

    if (artistId) {
      this.artistsService.findOne(artistId);
    }

    if (albumId) {
      this.albumsService.findOne(albumId);
    }

    const hasProperties = Object.keys(updateTrackDto).length > 0;

    if (!hasProperties) {
      throw new BadRequestException(null, 'Body is empty');
    }

    const track = this.findOne(trackId);

    const updatedTrack = { ...track, ...updateTrackDto };
    this.tracks[trackId] = updatedTrack;

    return updatedTrack;
  }

  remove(trackId: string) {
    if (this.favoritesService.isTrackExists(trackId)) {
      this.favoritesService.deleteTrack(trackId);
    }

    const track = this.findOne(trackId);

    delete this.tracks[track.id];

    return;
  }

  findTrackByArtistId(artistId: string) {
    const trackId = Object.keys(this.tracks).find(
      (id) => this.tracks[id].artistId === artistId,
    );

    return this.tracks[trackId];
  }

  findTrackByAlbumId(albumId: string) {
    const trackId = Object.keys(this.tracks).find(
      (id) => this.tracks[id].albumId === albumId,
    );

    return this.tracks[trackId];
  }

  findTracksByIds(tracksIds: string[]) {
    return tracksIds.map((id) => this.tracks[id]);
  }
}
