import { Injectable, ParseUUIDPipe } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { v4 } from 'uuid';

@Injectable()
@ValidatorConstraint({ name: 'timestamp', async: false })
export class TimestampValidator implements ValidatorConstraintInterface {
  public validate(timestamp: number): boolean {
    const now = Date.now();
    return now - 1000 * 60 * 5 < timestamp && timestamp < now;
  }

  public defaultMessage(): string {
    return 'Timestamp is not valid (can not be the value in the future or older than 5 minutes)';
  }
}

export enum UserEndpointResponseDescriptions {
  SUCCESS_OPERATION = 'Successful operation',
  ACCESS_TOKEN_MISSING = 'Access token is missing or invalid',
  INVALID_USER_ID = 'Bad request. userId is invalid (not uuid)',
  USER_NOT_FOUND = 'User not found',
  BODY_NOT_FULL = 'Bad request. body does not contain required fields',
}

export const UserApiParamOptions = {
  name: 'userId',
  format: 'uuid',
  required: true,
};
export const ParseUUIDPipeInstance = new ParseUUIDPipe({ version: '4' });
export const UserSchemaOnPUTMethod = {
  type: 'object',
  title: 'User',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      example: v4(),
    },
    login: {
      type: 'string',
      example: 'TestUser',
    },
    version: {
      type: 'integer',
      example: 2,
    },
    createAt: {
      type: 'integer',
      example: 1655000000,
    },
    updateAt: {
      type: 'integer',
      default: 1655999999,
    },
  },
};
