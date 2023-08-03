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
import { ResponseDescriptions } from '../app.utils';
import {
  AlbumApiParamOptions,
  AlbumBodyExamplesToUpdate,
  AlbumSchemaUpdated,
} from './albums.utils';

@ApiTags('Album')
@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  @ApiOperation({ summary: 'Gets all albums' })
  @ApiOkResponse({
    description: ResponseDescriptions.SUCCESS_OPERATION,
    type: Album,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.ACCESS_TOKEN_MISSING,
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
    description: ResponseDescriptions.SUCCESS_OPERATION,
    type: Album,
  })
  @ApiBadRequestResponse({
    description: ResponseDescriptions.INVALID_ID,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  @ApiNotFoundResponse({
    description: ResponseDescriptions.NOT_FOUND,
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
    description: ResponseDescriptions.BODY_NOT_FULL,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  create(@Body(ValidationPipe) createAlbumDto: CreateAlbumDto) {
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
    description: ResponseDescriptions.SUCCESS_OPERATION,
    schema: AlbumSchemaUpdated,
  })
  @ApiBadRequestResponse({
    description: `${ResponseDescriptions.INVALID_ID} or ${ResponseDescriptions.BODY_EMPTY}`,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  @ApiNotFoundResponse({
    description: ResponseDescriptions.NOT_FOUND,
  })
  update(
    @Param('albumId', ParseUUIDPipe) albumId: string,
    @Body(ValidationPipe) updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumsService.update(albumId, updateAlbumDto);
  }

  @Delete(':albumId')
  @ApiParam(AlbumApiParamOptions)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete album by ID from library' })
  @ApiNoContentResponse({ description: 'The album has been deleted' })
  @ApiBadRequestResponse({
    description: ResponseDescriptions.INVALID_ID,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  @ApiNotFoundResponse({
    description: ResponseDescriptions.NOT_FOUND,
  })
  remove(@Param('albumId', ParseUUIDPipe) albumId: string) {
    return this.albumsService.remove(albumId);
  }
}
