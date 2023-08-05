import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumsRepository: Repository<Album>,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  async findAll() {
    return await this.albumsRepository.find();
  }

  async findOne(id: string) {
    const album = await this.albumsRepository.findOneBy({ id });

    if (!album) {
      throw new NotFoundException();
    }

    return album;
  }

  async create(createAlbumDto: CreateAlbumDto) {
    const album = this.albumsRepository.create(createAlbumDto);

    return await this.albumsRepository.save(album);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.findOne(id);

    const updatedAlbum = { ...album, ...updateAlbumDto };

    return await this.albumsRepository.save(updatedAlbum);
  }

  async remove(albumId: string) {
    const { affected } = await this.albumsRepository.delete(albumId);

    if (affected === 0) {
      throw new NotFoundException();
    }
  }
}
