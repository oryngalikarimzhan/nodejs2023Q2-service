import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistsRepository: Repository<Artist>,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
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

    const updatedArtist = { ...artist, ...updateArtistDto };

    return await this.artistsRepository.save(updatedArtist);
  }

  async remove(artistId: string) {
    const { affected } = await this.artistsRepository.delete(artistId);

    if (affected === 0) {
      throw new NotFoundException();
    }

    const track = this.tracksService.findTrackByArtistId(artistId);

    if (track) {
      await this.tracksService.update(track.id, { artistId: null });
    }

    if (this.favoritesService.isArtistExists(artistId)) {
      this.favoritesService.deleteArtist(artistId);
    }
  }

  async findArtistsByIds(artistsIds: string[]) {
    return await this.artistsRepository.findBy({ id: In(artistsIds) });
  }
}
