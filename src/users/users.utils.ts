import { getApiParamWithUUIDOptions } from '../app.utils';

export const UserApiParamOptions = getApiParamWithUUIDOptions('userId');

export const UserSchemaUpdated = {
  type: 'object',
  title: 'User',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
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
