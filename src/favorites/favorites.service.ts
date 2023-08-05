import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteArtist } from './entities/favorite-artist.entity';
import { Repository } from 'typeorm';
import { FavoriteAlbum } from './entities/favorite-album.entity';
import { FavoriteTrack } from './entities/favorite-track.entity';

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
    @InjectRepository(FavoriteArtist)
    private readonly favoriteArtistsRepository: Repository<FavoriteArtist>,
    @InjectRepository(FavoriteAlbum)
    private readonly favoriteAlbumsRepository: Repository<FavoriteAlbum>,
    @InjectRepository(FavoriteTrack)
    private readonly favoriteTracksRepository: Repository<FavoriteTrack>,
  ) {}

  async findAll() {
    const [favArtists, favAlbums, favTracks] = await Promise.all([
      await this.favoriteArtistsRepository.find({ relations: ['artist'] }),
      await this.favoriteAlbumsRepository.find({ relations: ['album'] }),
      await this.favoriteTracksRepository.find({ relations: ['track'] }),
    ]);

    return {
      artists: favArtists.map(({ artist }) => artist),
      albums: favAlbums.map(({ album }) => album),
      tracks: favTracks.map(({ track }) => track),
    };
  }

  async addTrack(trackId: string) {
    const favTrack = this.favoriteTracksRepository.create({ trackId });

    try {
      await this.favoriteTracksRepository.save(favTrack);
    } catch (e) {
      if (e.code === '23503') {
        throw new UnprocessableEntityException(
          'track with this id does not exists',
        );
      }

      throw e;
    }
  }

  async deleteTrack(trackId: string) {
    const { affected } = await this.favoriteTracksRepository.delete({
      trackId,
    });

    if (affected === 0) {
      throw new NotFoundException();
    }
  }

  async addAlbum(albumId: string) {
    const favAlbum = this.favoriteAlbumsRepository.create({ albumId });

    try {
      await this.favoriteAlbumsRepository.save(favAlbum);
    } catch (e) {
      if (e.code === '23503') {
        throw new UnprocessableEntityException(
          'album with this id does not exists',
        );
      }

      throw e;
    }
  }

  async deleteAlbum(albumId: string) {
    const { affected } = await this.favoriteAlbumsRepository.delete({
      albumId,
    });

    if (affected === 0) {
      throw new NotFoundException();
    }
  }

  async addArtist(artistId: string) {
    const favArtist = this.favoriteArtistsRepository.create({ artistId });

    try {
      await this.favoriteArtistsRepository.save(favArtist);
    } catch (e) {
      if (e.code === '23503') {
        throw new UnprocessableEntityException(
          'artist with this id does not exists',
        );
      }

      throw e;
    }
  }

  async deleteArtist(artistId: string) {
    const { affected } = await this.favoriteArtistsRepository.delete({
      artistId,
    });

    if (affected === 0) {
      throw new NotFoundException();
    }
  }
}
