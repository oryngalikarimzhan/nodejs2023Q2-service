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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './user.entity';
import {
  ParseUUIDPipeInstance,
  UserApiParamOptions,
  UserEndpointResponseDescriptions,
  UserSchemaOnPUTMethod,
} from './user.utils';

@ApiTags('Users')
@ApiExtraModels(User, CreateUserDto, UpdatePasswordDto)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Gets all users', description: 'Gets all users' })
  @ApiOkResponse({
    description: UserEndpointResponseDescriptions.SUCCESS_OPERATION,
    type: User,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: UserEndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  findAll(): User[] {
    return this.userService.findAll();
  }

  @Get(':userId')
  @ApiParam(UserApiParamOptions)
  @ApiOperation({
    summary: 'Get single user by ID',
    description: 'Get single user by ID',
  })
  @ApiOkResponse({
    description: UserEndpointResponseDescriptions.SUCCESS_OPERATION,
    type: User,
  })
  @ApiBadRequestResponse({
    description: UserEndpointResponseDescriptions.INVALID_USER_ID,
  })
  @ApiUnauthorizedResponse({
    description: UserEndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  @ApiNotFoundResponse({
    description: UserEndpointResponseDescriptions.USER_NOT_FOUND,
  })
  findOne(@Param('userId', ParseUUIDPipeInstance) userId: string) {
    return this.userService.findOne(userId);
  }

  @Post()
  @ApiBody({
    required: true,
    type: CreateUserDto,
  })
  @ApiOperation({ summary: 'Creates user', description: 'Creates a new user' })
  @ApiCreatedResponse({
    description: 'The user has been created',
    type: User,
  })
  @ApiBadRequestResponse({
    description: UserEndpointResponseDescriptions.BODY_NOT_FULL,
  })
  @ApiUnauthorizedResponse({
    description: UserEndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':userId')
  @ApiParam(UserApiParamOptions)
  @ApiBody({
    required: true,
    type: UpdatePasswordDto,
  })
  @ApiOperation({
    summary: "Update a user's password",
    description: "Updates a user's password by ID",
  })
  @ApiOkResponse({
    description: UserEndpointResponseDescriptions.SUCCESS_OPERATION,
    schema: UserSchemaOnPUTMethod,
  })
  @ApiBadRequestResponse({
    description: UserEndpointResponseDescriptions.INVALID_USER_ID,
  })
  @ApiBadRequestResponse({
    description: UserEndpointResponseDescriptions.BODY_NOT_FULL,
  })
  @ApiUnauthorizedResponse({
    description: UserEndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  @ApiForbiddenResponse({ description: 'oldPassword is wrong' })
  @ApiNotFoundResponse({
    description: UserEndpointResponseDescriptions.USER_NOT_FOUND,
  })
  update(
    @Param('userId', ParseUUIDPipeInstance) userId: string,
    @Body(ValidationPipe) updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.update(userId, updatePasswordDto);
  }

  @Delete(':userId')
  @ApiParam(UserApiParamOptions)
  @ApiOperation({
    summary: 'Deletes user',
    description: 'Deletes user by ID',
  })
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'The user has been deleted' })
  @ApiBadRequestResponse({
    description: UserEndpointResponseDescriptions.INVALID_USER_ID,
  })
  @ApiUnauthorizedResponse({
    description: UserEndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  @ApiNotFoundResponse({
    description: UserEndpointResponseDescriptions.USER_NOT_FOUND,
  })
  remove(@Param('userId', ParseUUIDPipeInstance) userId: string) {
    return this.userService.remove(userId);
  }
}
