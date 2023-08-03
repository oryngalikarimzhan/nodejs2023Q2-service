import { ValueTransformer } from 'typeorm';
import { v4 } from 'uuid';

export const getApiParamWithUUIDOptions = (name: string) => ({
  name,
  format: 'uuid',
  required: true,
});

export const randomUUID = v4();

export enum ResponseDescriptions {
  SUCCESS_OPERATION = 'Successful operation',
  ACCESS_TOKEN_MISSING = 'Access token is missing or invalid',
  INVALID_ID = 'id is invalid (not uuid)',
  NOT_FOUND = 'Not found',
  BODY_NOT_FULL = 'Body does not contain required fields',
  BODY_EMPTY = 'Body is empty',
}

export class DateToTimestampTransformer implements ValueTransformer {
  to(value: Date): Date {
    return value;
  }

  from(value: Date): number {
    return value.getTime();
  }
}
