import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { User } from './entities/user.entity';
import { UserApiParamOptions, UserSchemaUpdated } from './users.utils';
import { ResponseDescriptions } from '../app.utils';

@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Gets all users' })
  @ApiOkResponse({
    description: ResponseDescriptions.SUCCESS_OPERATION,
    type: User,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':userId')
  @ApiParam(UserApiParamOptions)
  @ApiOperation({ summary: 'Get single user by ID' })
  @ApiOkResponse({
    description: ResponseDescriptions.SUCCESS_OPERATION,
    type: User,
  })
  @ApiBadRequestResponse({ description: ResponseDescriptions.INVALID_ID })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  @ApiNotFoundResponse({ description: ResponseDescriptions.NOT_FOUND })
  findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.usersService.findOne(userId);
  }

  @Post()
  @ApiBody({
    required: true,
    type: CreateUserDto,
  })
  @ApiOperation({ summary: 'Creates a new user' })
  @ApiCreatedResponse({
    description: 'The user has been created',
    type: User,
  })
  @ApiBadRequestResponse({ description: ResponseDescriptions.BODY_NOT_FULL })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  @ApiForbiddenResponse({ description: 'User with this login already exists' })
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':userId')
  @ApiParam(UserApiParamOptions)
  @ApiBody({
    required: true,
    type: UpdateUserPasswordDto,
  })
  @ApiOperation({ summary: "Update a user's password by ID" })
  @ApiOkResponse({
    description: ResponseDescriptions.SUCCESS_OPERATION,
    schema: UserSchemaUpdated,
  })
  @ApiBadRequestResponse({
    description: `${ResponseDescriptions.INVALID_ID} or 
      ${ResponseDescriptions.BODY_NOT_FULL} or 
      oldPassword and newPassword are the same`,
  })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  @ApiForbiddenResponse({ description: 'oldPassword is wrong' })
  @ApiNotFoundResponse({ description: ResponseDescriptions.NOT_FOUND })
  update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body(ValidationPipe) updatePasswordDto: UpdateUserPasswordDto,
  ) {
    return this.usersService.update(userId, updatePasswordDto);
  }

  @Delete(':userId')
  @ApiParam(UserApiParamOptions)
  @ApiOperation({ summary: 'Deletes user by ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'The user has been deleted' })
  @ApiBadRequestResponse({ description: ResponseDescriptions.INVALID_ID })
  @ApiUnauthorizedResponse({
    description: ResponseDescriptions.NO_ACCESS_TOKEN,
  })
  @ApiNotFoundResponse({ description: ResponseDescriptions.NOT_FOUND })
  remove(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.usersService.remove(userId);
  }
}
