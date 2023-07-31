import { getApiParamWithUUIDOptions, randomUUID } from '../app.utils';

export const ArtistApiParamOptions = getApiParamWithUUIDOptions('artistId');

export const ArtistSchemaUpdated = {
  type: 'object',
  title: 'Artist',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      example: randomUUID,
    },
    name: {
      type: 'string',
      example: 'Freddie Mercury',
    },
    grammy: {
      type: 'boolean',
      example: true,
    },
  },
};

export const ArtistBodyExamplesToUpdate = {
  full: {
    value: {
      name: 'James Bond',
      grammy: true,
    },
  },
  partial: {
    value: {
      grammy: true,
    },
  },
};
