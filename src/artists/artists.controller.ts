import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseUUIDPipe,
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

import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { EndpointResponseDescriptions } from '../app.utils';
import {
  ArtistApiParamOptions,
  ArtistBodyExamplesToUpdate,
  ArtistSchemaUpdated,
} from './artists.utils';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';

@ApiTags('Artist')
@Controller('artist')
export class ArtistsController {
  constructor(
    private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Gets all artists' })
  @ApiOkResponse({
    description: EndpointResponseDescriptions.SUCCESS_OPERATION,
    type: Artist,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: EndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':artistId')
  @ApiParam(ArtistApiParamOptions)
  @ApiOperation({
    summary: 'Get single artist by ID',
  })
  @ApiOkResponse({
    description: EndpointResponseDescriptions.SUCCESS_OPERATION,
    type: Artist,
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
  findOne(@Param('artistId', ParseUUIDPipe) artistId: string) {
    return this.artistsService.findOne(artistId);
  }

  @Post()
  @ApiOperation({ summary: 'Add new artist' })
  @ApiBody({
    required: true,
    type: CreateArtistDto,
  })
  @ApiCreatedResponse({
    description: 'The user has been created',
    type: Artist,
  })
  @ApiBadRequestResponse({
    description: EndpointResponseDescriptions.BODY_NOT_FULL,
  })
  @ApiUnauthorizedResponse({
    description: EndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  create(@Body(ValidationPipe) createArtistDto: CreateArtistDto) {
    return this.artistsService.create(createArtistDto);
  }

  @Put(':artistId')
  @ApiParam(ArtistApiParamOptions)
  @ApiBody({
    description: 'Have to contain at least one field',
    required: true,
    type: UpdateArtistDto,
    examples: ArtistBodyExamplesToUpdate,
  })
  @ApiOperation({ summary: 'Update artist information by ID' })
  @ApiOkResponse({
    description: EndpointResponseDescriptions.SUCCESS_OPERATION,
    schema: ArtistSchemaUpdated,
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
    @Param('artistId', ParseUUIDPipe) artistId: string,
    @Body(ValidationPipe) updateArtistDto: UpdateArtistDto,
  ) {
    return this.artistsService.update(artistId, updateArtistDto);
  }

  @Delete(':artistId')
  @ApiParam(ArtistApiParamOptions)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete artist by ID from library' })
  @ApiNoContentResponse({ description: 'The artist has been deleted' })
  @ApiBadRequestResponse({
    description: EndpointResponseDescriptions.INVALID_ID,
  })
  @ApiUnauthorizedResponse({
    description: EndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  @ApiNotFoundResponse({
    description: EndpointResponseDescriptions.NOT_FOUND,
  })
  remove(@Param('artistId', ParseUUIDPipe) artistId: string) {
    const album = this.albumsService.findAlbumByArtistId(artistId);
    const track = this.tracksService.findTrackByArtistId(artistId);

    if (album) {
      this.albumsService.update(album.id, { artistId: null });
    }

    if (track) {
      this.tracksService.update(track.id, { artistId: null });
    }

    if (this.favoritesService.isArtistExists(artistId)) {
      this.favoritesService.deleteArtist(artistId);
    }

    return this.artistsService.remove(artistId);
  }
}
