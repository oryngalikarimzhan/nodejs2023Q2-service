import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  Put,
  HttpStatus,
  HttpCode,
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

import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { EndpointResponseDescriptions } from '../app.utils';
import { Track } from './entities/track.entity';
import {
  TrackApiParamOptions,
  TrackBodyExamplesToUpdate,
  TrackSchemaUpdated,
} from './track.utils';

@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @ApiOperation({ summary: 'Gets all library tracks list' })
  @ApiOkResponse({
    description: EndpointResponseDescriptions.SUCCESS_OPERATION,
    type: Track,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: EndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':trackId')
  @ApiParam(TrackApiParamOptions)
  @ApiOperation({ summary: 'Gets single track by id' })
  @ApiOkResponse({
    description: EndpointResponseDescriptions.SUCCESS_OPERATION,
    type: Track,
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
  findOne(@Param('trackId', ParseUUIDPipe) trackId: string) {
    return this.trackService.findOne(trackId);
  }

  @Post()
  @ApiOperation({ summary: 'Add new track' })
  @ApiBody({
    required: true,
    type: CreateTrackDto,
  })
  @ApiCreatedResponse({
    description: 'The track has been created',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: EndpointResponseDescriptions.BODY_NOT_FULL,
  })
  @ApiUnauthorizedResponse({
    description: EndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  create(@Body(ValidationPipe) createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Put(':trackId')
  @ApiParam(TrackApiParamOptions)
  @ApiBody({
    description: 'Have to contain at least one field',
    required: true,
    type: UpdateTrackDto,
    examples: TrackBodyExamplesToUpdate,
  })
  @ApiOperation({ summary: 'Update library track information by ID' })
  @ApiOkResponse({
    description: EndpointResponseDescriptions.SUCCESS_OPERATION,
    schema: TrackSchemaUpdated,
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
    @Param('trackId', ParseUUIDPipe) trackId: string,
    @Body(ValidationPipe) updateTrackDto: UpdateTrackDto,
  ) {
    return this.trackService.update(trackId, updateTrackDto);
  }

  @Delete(':trackId')
  @ApiParam(TrackApiParamOptions)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete track from library by ID' })
  @ApiNoContentResponse({ description: 'The track has been deleted' })
  @ApiBadRequestResponse({
    description: EndpointResponseDescriptions.INVALID_ID,
  })
  @ApiUnauthorizedResponse({
    description: EndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  @ApiNotFoundResponse({
    description: EndpointResponseDescriptions.NOT_FOUND,
  })
  remove(@Param('trackId', ParseUUIDPipe) trackId: string) {
    return this.trackService.remove(trackId);
  }
}
