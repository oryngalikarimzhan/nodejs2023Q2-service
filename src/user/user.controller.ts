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

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { UserApiParamOptions, UserSchemaUpdated } from './user.utils';
import { EndpointResponseDescriptions } from '../app.utils';

@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Gets all users' })
  @ApiOkResponse({
    description: EndpointResponseDescriptions.SUCCESS_OPERATION,
    type: User,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: EndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  findAll(): User[] {
    return this.userService.findAll();
  }

  @Get(':userId')
  @ApiParam(UserApiParamOptions)
  @ApiOperation({ summary: 'Get single user by ID' })
  @ApiOkResponse({
    description: EndpointResponseDescriptions.SUCCESS_OPERATION,
    type: User,
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
  findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.findOne(userId);
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
  @ApiBadRequestResponse({
    description: EndpointResponseDescriptions.BODY_NOT_FULL,
  })
  @ApiUnauthorizedResponse({
    description: EndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  @ApiForbiddenResponse({
    description: 'User with this login already exists',
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
  @ApiOperation({ summary: "Update a user's password by ID" })
  @ApiOkResponse({
    description: EndpointResponseDescriptions.SUCCESS_OPERATION,
    schema: UserSchemaUpdated,
  })
  @ApiBadRequestResponse({
    description: `${EndpointResponseDescriptions.INVALID_ID} or ${EndpointResponseDescriptions.BODY_NOT_FULL} or oldPassword and newPassword are the same`,
  })
  @ApiUnauthorizedResponse({
    description: EndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  @ApiForbiddenResponse({
    description: 'oldPassword is wrong',
  })
  @ApiNotFoundResponse({
    description: EndpointResponseDescriptions.NOT_FOUND,
  })
  update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body(ValidationPipe) updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.update(userId, updatePasswordDto);
  }

  @Delete(':userId')
  @ApiParam(UserApiParamOptions)
  @ApiOperation({ summary: 'Deletes user by ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'The user has been deleted' })
  @ApiBadRequestResponse({
    description: EndpointResponseDescriptions.INVALID_ID,
  })
  @ApiUnauthorizedResponse({
    description: EndpointResponseDescriptions.ACCESS_TOKEN_MISSING,
  })
  @ApiNotFoundResponse({
    description: EndpointResponseDescriptions.NOT_FOUND,
  })
  remove(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.remove(userId);
  }
}
