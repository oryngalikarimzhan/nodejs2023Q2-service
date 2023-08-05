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

import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ResponseDescriptions } from '../app.utils';
import { Track } from './entities/track.entity';
import {
  TrackApiParamOptions,
  TrackBodyExamplesToUpdate,
  TrackSchemaUpdated,
} from './tracks.utils';

@ApiTags('Track')
@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @ApiOperation({ summary: 'Gets all library tracks list' })
  @ApiOkResponse({
    description: ResponseDescriptions.SUCCESS_OPERATION,
    type: Track,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  findAll() {
    return this.tracksService.findAll();
  }

  @Get(':trackId')
  @ApiParam(TrackApiParamOptions)
  @ApiOperation({ summary: 'Gets single track by id' })
  @ApiOkResponse({
    description: ResponseDescriptions.SUCCESS_OPERATION,
    type: Track,
  })
  @ApiBadRequestResponse({
    description: ResponseDescriptions.INVALID_ID,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  @ApiNotFoundResponse({
    description: ResponseDescriptions.NOT_FOUND,
  })
  findOne(@Param('trackId', ParseUUIDPipe) trackId: string) {
    return this.tracksService.findOne(trackId);
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
    description: ResponseDescriptions.BODY_NOT_FULL,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  create(@Body(ValidationPipe) createTrackDto: CreateTrackDto) {
    return this.tracksService.create(createTrackDto);
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
    description: ResponseDescriptions.SUCCESS_OPERATION,
    schema: TrackSchemaUpdated,
  })
  @ApiBadRequestResponse({
    description: `${ResponseDescriptions.INVALID_ID}`,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  @ApiNotFoundResponse({
    description: ResponseDescriptions.NOT_FOUND,
  })
  update(
    @Param('trackId', ParseUUIDPipe) trackId: string,
    @Body(ValidationPipe) updateTrackDto: UpdateTrackDto,
  ) {
    return this.tracksService.update(trackId, updateTrackDto);
  }

  @Delete(':trackId')
  @ApiParam(TrackApiParamOptions)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete track from library by ID' })
  @ApiNoContentResponse({ description: 'The track has been deleted' })
  @ApiBadRequestResponse({
    description: ResponseDescriptions.INVALID_ID,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  @ApiNotFoundResponse({
    description: ResponseDescriptions.NOT_FOUND,
  })
  remove(@Param('trackId', ParseUUIDPipe) trackId: string) {
    return this.tracksService.remove(trackId);
  }
}
