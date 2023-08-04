import { v4 } from 'uuid';
import { getApiParamWithUUIDOptions, randomID } from '../app.utils';

export const AlbumApiParamOptions = getApiParamWithUUIDOptions('albumId');

const artistRandomId = v4();

export const AlbumSchemaUpdated = {
  type: 'object',
  title: 'Album',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      example: randomID,
    },
    name: {
      type: 'string',
      example: 'Diamond',
    },
    year: {
      type: 'integer',
      example: 2010,
    },
    artistId: {
      type: 'string',
      format: 'uuid',
      example: artistRandomId,
    },
  },
};

export const AlbumBodyExamplesToUpdate = {
  full: {
    value: {
      name: 'Diamond',
      year: 2010,
      artistId: artistRandomId,
    },
  },
  partial: {
    value: {
      name: 'Diamond',
    },
  },
};
