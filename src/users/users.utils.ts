import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { getApiParamWithUUIDOptions, randomUUID } from '../app.utils';
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

export const UserApiParamOptions = getApiParamWithUUIDOptions('userId');

export const UserSchemaUpdated = {
  type: 'object',
  title: 'User',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      example: randomUUID,
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
