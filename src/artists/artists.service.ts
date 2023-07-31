import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  artists: Record<string, Artist> = {};

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
    const artist = this.findOne(artistId);

    delete this.artists[artist.id];

    return;
  }
}
