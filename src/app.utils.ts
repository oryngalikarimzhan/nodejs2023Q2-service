import { randomUUID } from 'crypto';

export const getApiParamWithUUIDOptions = (name: string) => ({
  name,
  format: 'uuid',
  required: true,
});

export const randomID = randomUUID();

export const ResponseDescription = {
  SUCCESS_OPERATION: { description: 'Successful operation' },
  NO_ACCESS_TOKEN: { description: 'Access token is missing or invalid' },
  INVALID_ID: { description: 'id is invalid (not uuid)' },
  NOT_FOUND: { description: 'Not found' },
  BODY_NOT_FULL: {
    description: 'Body object does not contain required fields',
  },
};
