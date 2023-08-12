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
import { ResponseDescription } from '../app.utils';
import {
  ArtistApiParamOptions,
  ArtistBodyExamplesToUpdate,
  ArtistSchemaUpdated,
} from './artists.utils';

@ApiTags('Artist')
@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  @ApiOperation({ summary: 'Gets all artists' })
  @ApiOkResponse({
    ...ResponseDescription.SUCCESS_OPERATION,
    type: Artist,
    isArray: true,
  })
  @ApiUnauthorizedResponse(ResponseDescription.NO_ACCESS_TOKEN)
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':artistId')
  @ApiParam(ArtistApiParamOptions)
  @ApiOperation({ summary: 'Get single artist by ID' })
  @ApiOkResponse({
    ...ResponseDescription.SUCCESS_OPERATION,
    type: Artist,
  })
  @ApiBadRequestResponse(ResponseDescription.INVALID_ID)
  @ApiUnauthorizedResponse(ResponseDescription.NO_ACCESS_TOKEN)
  @ApiNotFoundResponse(ResponseDescription.NOT_FOUND)
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
  @ApiBadRequestResponse(ResponseDescription.BODY_NOT_FULL)
  @ApiUnauthorizedResponse(ResponseDescription.NO_ACCESS_TOKEN)
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
    ...ResponseDescription.SUCCESS_OPERATION,
    schema: ArtistSchemaUpdated,
  })
  @ApiBadRequestResponse(ResponseDescription.INVALID_ID)
  @ApiUnauthorizedResponse(ResponseDescription.NO_ACCESS_TOKEN)
  @ApiNotFoundResponse(ResponseDescription.NOT_FOUND)
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
  @ApiBadRequestResponse(ResponseDescription.INVALID_ID)
  @ApiUnauthorizedResponse(ResponseDescription.NO_ACCESS_TOKEN)
  @ApiNotFoundResponse(ResponseDescription.NOT_FOUND)
  remove(@Param('artistId', ParseUUIDPipe) artistId: string) {
    return this.artistsService.remove(artistId);
  }
}
