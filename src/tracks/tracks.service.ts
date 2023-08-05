import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { FavoritesService } from '../favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class TracksService {
  tracks: Record<string, Track> = {};

  constructor(
    @InjectRepository(Track)
    private readonly tracksRepository: Repository<Track>,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  async findAll() {
    return await this.tracksRepository.find();
  }

  async findOne(id: string) {
    const track = await this.tracksRepository.findOneBy({ id });

    if (!track) {
      throw new NotFoundException();
    }

    return track;
  }

  async create(createTrackDto: CreateTrackDto) {
    const track = this.tracksRepository.create(createTrackDto);

    return await this.tracksRepository.save(track);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.findOne(id);

    const updatedATrack = { ...track, ...updateTrackDto };

    return await this.tracksRepository.save(updatedATrack);
  }

  async remove(trackId: string) {
    const { affected } = await this.tracksRepository.delete(trackId);

    if (affected === 0) {
      throw new NotFoundException();
    }

    if (this.favoritesService.isTrackExists(trackId)) {
      this.favoritesService.deleteTrack(trackId);
    }
  }

  async findTrackByArtistId(id: string) {
    return await this.tracksRepository.findOneBy({ artist: { id } });
  }

  async findTrackByAlbumId(id: string) {
    return await this.tracksRepository.findOneBy({ album: { id } });
  }

  async findTracksByIds(tracksIds: string[]) {
    return await this.tracksRepository.findBy({ id: In(tracksIds) });
  }
}
