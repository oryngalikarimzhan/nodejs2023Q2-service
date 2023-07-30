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

import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { EndpointResponseDescriptions } from '../app.utils';
import {
  ArtistApiParamOptions,
  ArtistBodyExamplesToUpdate,
  ArtistSchemaUpdated,
} from './artist.utils';

@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

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
    return this.artistService.findAll();
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
    return this.artistService.findOne(artistId);
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
    return this.artistService.create(createArtistDto);
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
    return this.artistService.update(artistId, updateArtistDto);
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
    return this.artistService.remove(artistId);
  }
}
