import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly tracksRepository: Repository<Track>,
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

    return await this.tracksRepository.save({ ...track, ...updateTrackDto });
  }

  async remove(trackId: string) {
    const { affected } = await this.tracksRepository.delete(trackId);

    if (affected === 0) {
      throw new NotFoundException();
    }
  }
}
