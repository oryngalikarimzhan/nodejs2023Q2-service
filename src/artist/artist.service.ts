import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './artist.entity';

@Injectable()
export class ArtistService {
  artists: Record<string, Artist> = {};

  findAll() {
    return Object.keys(this.artists).map((artistId) => this.artists[artistId]);
  }

  create({ name, grammy }: CreateArtistDto) {
    const hasArtist = !!Object.keys(this.artists).find(
      (artistId) => this.artists[artistId].name === name,
    );

    if (hasArtist) {
      throw new ForbiddenException(
        null,
        'Artist with this name already exists',
      );
    }

    const artist = new Artist(name, grammy);
    this.artists[artist.id] = artist;

    return artist;
  }

  findOne(artistId: string) {
    const artist = this.artists[artistId];

    if (!artist) {
      throw new NotFoundException();
    }

    return artist;
  }

  update(artistId: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.findOne(artistId);

    const updatedArtist = { ...artist, ...updateArtistDto };
    this.artists[artist.id] = updatedArtist;

    return updatedArtist;
  }

  remove(artistId: string) {
    const artist = this.findOne(artistId);

    delete this.artists[artist.id];

    return;
  }
}
