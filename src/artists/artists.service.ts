import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistsRepository: Repository<Artist>,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  async findOne(artistId: string) {
    const artist = await this.artistsRepository.findOne({
      where: { id: artistId },
    });

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
    const hasProperties = Object.keys(updateArtistDto).length > 0;

    if (!hasProperties) {
      throw new BadRequestException('Body is empty');
    }

    const artist = await this.findOne(artistId);

    const updatedArtist = { ...artist, ...updateArtistDto };

    return this.artistsRepository.save(updatedArtist);
  }

  async remove(artistId: string) {
    const album = await this.albumsService.findAlbumByArtistId(artistId);
    const track = this.tracksService.findTrackByArtistId(artistId);

    if (album) {
      await this.albumsService.update(album.id, { artistId: null });
    }

    if (track) {
      await this.tracksService.update(track.id, { artistId: null });
    }

    if (this.favoritesService.isArtistExists(artistId)) {
      this.favoritesService.deleteArtist(artistId);
    }

    const result = await this.artistsRepository.delete(artistId);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async findArtistsByIds(artistsIds: string[]) {
    return await this.artistsRepository.findBy({ id: In(artistsIds) });
  }
}
