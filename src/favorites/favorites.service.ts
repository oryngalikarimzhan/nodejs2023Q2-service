import { Injectable } from '@nestjs/common';

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

  findAll() {
    return this.favorites;
  }

  addTrack(id: string) {
    return this.favorites.tracksIds.add(id);
  }

  deleteTrack(id: string) {
    return this.favorites.tracksIds.delete(id);
  }

  addAlbum(id: string) {
    return this.favorites.albumsIds.add(id);
  }

  deleteAlbum(id: string) {
    return this.favorites.albumsIds.delete(id);
  }

  addArtist(id: string) {
    return this.favorites.artistsIds.add(id);
  }

  deleteArtist(id: string) {
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
