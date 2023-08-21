import { randomUUID } from 'crypto';

import { getApiParamWithUUIDOptions, randomID } from '../app.utils';

export const TrackApiParamOptions = getApiParamWithUUIDOptions('trackId');

const artistRandomId = randomUUID();
const albumRandomId = randomUUID();

export const TrackSchemaUpdated = {
  type: 'object',
  title: 'Track',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      example: randomID,
    },
    name: {
      type: 'string',
      example: 'The Show Must Go On',
    },
    artistId: {
      type: 'string',
      format: 'uuid',
      example: artistRandomId,
    },
    albumId: {
      type: 'string',
      format: 'uuid',
      example: albumRandomId,
    },
    duration: {
      type: 'integer',
      example: 300,
    },
  },
};

export const TrackBodyExamplesToUpdate = {
  full: {
    value: {
      name: 'The Show Must End',
      artistId: artistRandomId,
      albumId: albumRandomId,
      duration: 300,
    },
  },
  partial: {
    value: {
      name: 'The Show Must End',
    },
  },
};
