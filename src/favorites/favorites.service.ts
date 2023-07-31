import { Injectable } from '@nestjs/common';

import { Artist } from '../artists/entities/artist.entity';
import { Album } from '../albums/entities/album.entity';
import { Track } from '../tracks/entities/track.entity';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';

@Injectable()
export class FavoritesService {
  favorites: { artists: Artist[]; albums: Album[]; tracks: Track[] } = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    private readonly tracksService: TracksService,
    private readonly albumsService: AlbumsService,
    private readonly artistsService: ArtistsService,
  ) {}

  findAll() {
    return this.artistsService.findAll();
  }

  addTrack(id: string) {
    return id;
  }

  deleteTrack(id: string) {
    return id;
  }

  addAlbum(id: string) {
    return id;
  }

  deleteAlbum(id: string) {
    return id;
  }

  addArtist(id: string) {
    return id;
  }

  deleteArtist(id: string) {
    return id;
  }
}
