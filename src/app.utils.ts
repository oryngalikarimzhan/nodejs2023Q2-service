import { ParseUUIDPipe } from '@nestjs/common';
import { v4 } from 'uuid';
export const ParseUUIDPipeInstance = new ParseUUIDPipe({ version: '4' });

export const getApiParamWithUUIDOptions = (name: string) => ({
  name,
  format: 'uuid',
  required: true,
});

export const randomUUID = v4();

export enum EndpointResponseDescriptions {
  SUCCESS_OPERATION = 'Successful operation',
  ACCESS_TOKEN_MISSING = 'Access token is missing or invalid',
  INVALID_ID = 'Bad request. Id is invalid (not uuid)',
  NOT_FOUND = 'Not found',
  BODY_NOT_FULL = 'Bad request. Body does not contain required fields',
  BODY_EMPTY = 'Bad request. Body is empty',
}
