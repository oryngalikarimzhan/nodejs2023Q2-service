import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';

import { FavoritesService } from './favorites.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Favorites } from './dto/favorites.dto';
import { ResponseDescriptions } from '../app.utils';
import { FavoritesApiParamOptions } from './favorites.utils';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiOkResponse({ type: Favorites, description: 'Successful operation' })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  @ApiParam(FavoritesApiParamOptions)
  @ApiOperation({ summary: 'Add track to the favorites' })
  @ApiCreatedResponse({ description: 'Added successfully' })
  @ApiBadRequestResponse({
    description: ResponseDescriptions.INVALID_ID,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  @ApiUnprocessableEntityResponse({
    description: "Track with id doesn't exist",
  })
  addTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.addTrack(id);
  }

  @Delete('track/:id')
  @ApiParam(FavoritesApiParamOptions)
  @ApiOperation({ summary: 'Delete track from favorites' })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiBadRequestResponse({
    description: ResponseDescriptions.INVALID_ID,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  @ApiNotFoundResponse({ description: 'Track was not found' })
  @HttpCode(204)
  deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.deleteTrack(id);
    return;
  }

  @Post('album/:id')
  @ApiParam(FavoritesApiParamOptions)
  @ApiOperation({ summary: 'Add album to the favorites' })
  @ApiCreatedResponse({ description: 'Added successfully' })
  @ApiBadRequestResponse({
    description: ResponseDescriptions.INVALID_ID,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  @ApiUnprocessableEntityResponse({
    description: "Album with id doesn't exist",
  })
  addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.addAlbum(id);
  }

  @Delete('album/:id')
  @ApiParam(FavoritesApiParamOptions)
  @ApiOperation({ summary: 'Delete album from favorites' })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiBadRequestResponse({
    description: ResponseDescriptions.INVALID_ID,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  @ApiNotFoundResponse({ description: 'Album was not found' })
  @HttpCode(204)
  deleteAlbum(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.deleteAlbum(id);
    return;
  }

  @Post('artist/:id')
  @ApiParam(FavoritesApiParamOptions)
  @ApiOperation({ summary: 'Add artist to the favorites' })
  @ApiCreatedResponse({ description: 'Added successfully' })
  @ApiBadRequestResponse({
    description: ResponseDescriptions.INVALID_ID,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  @ApiUnprocessableEntityResponse({
    description: "Artist with id doesn't exist",
  })
  addArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.addArtist(id);
  }

  @Delete('artist/:id')
  @ApiParam(FavoritesApiParamOptions)
  @ApiOperation({ summary: 'Delete artist from favorites' })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiBadRequestResponse({
    description: ResponseDescriptions.INVALID_ID,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  @ApiNotFoundResponse({ description: 'Artist was not found' })
  @HttpCode(204)
  deleteArtist(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.deleteArtist(id);
    return;
  }
}
