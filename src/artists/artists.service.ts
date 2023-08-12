import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistsRepository: Repository<Artist>,
  ) {}

  async findOne(id: string) {
    const artist = await this.artistsRepository.findOneBy({ id });

    if (!artist) {
      throw new NotFoundException();
    }

    return artist;
  }

  async findAll() {
    return await this.artistsRepository.find();
  }

  async create(createUserDto: CreateArtistDto) {
    const artist = this.artistsRepository.create(createUserDto);

    return await this.artistsRepository.save(artist);
  }

  async update(artistId: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findOne(artistId);

    return await this.artistsRepository.save({ ...artist, ...updateArtistDto });
  }

  async remove(artistId: string) {
    const { affected } = await this.artistsRepository.delete(artistId);

    if (affected === 0) {
      throw new NotFoundException();
    }
  }
}
