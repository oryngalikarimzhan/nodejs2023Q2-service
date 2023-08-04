import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';
import { ArtistsService } from '../artists/artists.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumsRepository: Repository<Album>,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  async findAll() {
    return await this.albumsRepository.find();
  }

  async findOne(albumId: string) {
    const album = await this.albumsRepository.findOne({
      where: { id: albumId },
    });

    if (!album) {
      throw new NotFoundException();
    }

    return album;
  }

  async create(createAlbumDto: CreateAlbumDto) {
    await this.artistsService.findOne(createAlbumDto.artistId);

    const album = this.albumsRepository.create(createAlbumDto);

    return await this.albumsRepository.save(album);
  }

  async update(albumId: string, updateAlbumDto: UpdateAlbumDto) {
    const hasProperties = Object.keys(updateAlbumDto).length > 0;

    if (!hasProperties) {
      throw new BadRequestException('Body is empty');
    }

    const { artistId } = updateAlbumDto;

    if (artistId) {
      await this.artistsService.findOne(artistId);
    }

    const album = await this.findOne(albumId);

    const updatedAlbum = { ...album, ...updateAlbumDto };

    return this.albumsRepository.save(updatedAlbum);
  }

  async remove(albumId: string) {
    const result = await this.albumsRepository.delete(albumId);

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    const isAlbumExists = this.favoritesService.isAlbumExists(albumId);
    const track = this.tracksService.findTrackByAlbumId(albumId);

    if (isAlbumExists) {
      this.favoritesService.deleteAlbum(albumId);
    }

    if (track) {
      await this.tracksService.update(track.id, { albumId: null });
    }
  }

  async findAlbumByArtistId(artistId: string) {
    return await this.albumsRepository.findOne({ where: { artistId } });
  }

  async findAlbumsByIds(albumsIds: string[]) {
    return await this.albumsRepository.findBy({ id: In(albumsIds) });
  }
}
