import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';

import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  addTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.addTrack(id);
  }

  @Delete('track/:id')
  deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.deleteTrack(id);
  }

  @Post('album/:id')
  addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.addAlbum(id);
  }

  @Delete('album/:id')
  deleteAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.deleteAlbum(id);
  }

  @Post('artist/:id')
  addArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.addArtist(id);
  }

  @Delete('artist/:id')
  deleteArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.deleteArtist(id);
  }
}
