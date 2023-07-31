import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  ValidationPipe,
  Put,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { EndpointResponseDescriptions } from '../app.utils';
import {
  AlbumApiParamOptions,
  AlbumBodyExamplesToUpdate,
  AlbumSchemaUpdated,
} from './albums.utils';
import { TracksService } from '../tracks/tracks.service';
import { ArtistsService } from '../artists/artists.service';
import { FavoritesService } from '../favorites/favorites.service';

@ApiTags('Album')
@Controller('album')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
    private readonly artistsService: ArtistsService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Gets all albums' })
  @ApiOkResponse({
    description: EndpointResponseDescriptions.SUCCESS_OPERATION,
    type: Album,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: EndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  findAll() {
    return this.albumsService.findAll();
  }

  @Get(':albumId')
  @ApiParam(AlbumApiParamOptions)
  @ApiOperation({
    summary: 'Get single album by ID',
  })
  @ApiOkResponse({
    description: EndpointResponseDescriptions.SUCCESS_OPERATION,
    type: Album,
  })
  @ApiBadRequestResponse({
    description: EndpointResponseDescriptions.INVALID_ID,
  })
  @ApiUnauthorizedResponse({
    description: EndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  @ApiNotFoundResponse({
    description: EndpointResponseDescriptions.NOT_FOUND,
  })
  findOne(@Param('albumId', ParseUUIDPipe) albumId: string) {
    return this.albumsService.findOne(albumId);
  }

  @Post()
  @ApiOperation({ summary: 'Add new album' })
  @ApiBody({
    required: true,
    type: CreateAlbumDto,
  })
  @ApiCreatedResponse({
    description: 'The album has been created',
    type: Album,
  })
  @ApiBadRequestResponse({
    description: EndpointResponseDescriptions.BODY_NOT_FULL,
  })
  @ApiUnauthorizedResponse({
    description: EndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  create(@Body(ValidationPipe) createAlbumDto: CreateAlbumDto) {
    const { artistId } = createAlbumDto;
    if (artistId) {
      this.artistsService.findOne(artistId);
    }

    return this.albumsService.create(createAlbumDto);
  }

  @Put(':albumId')
  @ApiParam(AlbumApiParamOptions)
  @ApiBody({
    description: 'Have to contain at least one field',
    required: true,
    type: UpdateAlbumDto,
    examples: AlbumBodyExamplesToUpdate,
  })
  @ApiOperation({ summary: 'Update album information by ID' })
  @ApiOkResponse({
    description: EndpointResponseDescriptions.SUCCESS_OPERATION,
    schema: AlbumSchemaUpdated,
  })
  @ApiBadRequestResponse({
    description: `${EndpointResponseDescriptions.INVALID_ID} or ${EndpointResponseDescriptions.BODY_EMPTY}`,
  })
  @ApiUnauthorizedResponse({
    description: EndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  @ApiNotFoundResponse({
    description: EndpointResponseDescriptions.NOT_FOUND,
  })
  update(
    @Param('albumId', ParseUUIDPipe) albumId: string,
    @Body(ValidationPipe) updateAlbumDto: UpdateAlbumDto,
  ) {
    const artistId = updateAlbumDto?.artistId;

    if (artistId) {
      this.artistsService.findOne(artistId);
    }

    return this.albumsService.update(albumId, updateAlbumDto);
  }

  @Delete(':albumId')
  @ApiParam(AlbumApiParamOptions)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete album by ID from library' })
  @ApiNoContentResponse({ description: 'The album has been deleted' })
  @ApiBadRequestResponse({
    description: EndpointResponseDescriptions.INVALID_ID,
  })
  @ApiUnauthorizedResponse({
    description: EndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  @ApiNotFoundResponse({
    description: EndpointResponseDescriptions.NOT_FOUND,
  })
  remove(@Param('albumId', ParseUUIDPipe) albumId: string) {
    const album = this.favoritesService.isAlbumExists(albumId);
    const track = this.tracksService.findTrackByAlbumId(albumId);

    if (album) {
      this.favoritesService.deleteAlbum(albumId);
    }

    if (track) {
      this.tracksService.update(track.id, { albumId: null });
    }

    return this.albumsService.remove(albumId);
  }
}
