import { randomUUID } from 'crypto';

export const getApiParamWithUUIDOptions = (name: string) => ({
  name,
  format: 'uuid',
  required: true,
});

export const randomID = randomUUID();

export enum ResponseDescriptions {
  SUCCESS_OPERATION = 'Successful operation',
  NO_ACCESS_TOKEN = 'Access token is missing or invalid',
  INVALID_ID = 'id is invalid (not uuid)',
  NOT_FOUND = 'Not found',
  BODY_NOT_FULL = 'Body object does not contain required fields',
}
