import { get } from 'lodash';
import { IPageable, IPageableCount } from './common/types';
import * as uuid from 'uuid';
import { SortOrder } from 'mongoose';

export const getUserIdFromRequest = (req: any) => {
  return get(req, ['user', 'sub'], '');
};

export const buildPageable = ({
  limit,
  offset,
  total,
}: {
  limit: number;
  offset: number;
  total: number;
}): IPageableCount => {
  const maxOffset = offset <= total ? offset : total;
  const maxLimit = limit <= total ? limit : total;
  return {
    total,
    pageNumber: Math.floor(maxOffset / maxLimit) + 1,
    pageTotal: Math.ceil(total / maxLimit),
    limit: maxLimit,
    offset: maxOffset,
  };
};

export const extractPageable = ({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}): IPageable => ({
  limit: Number(limit) ?? 20,
  offset: Number(offset) ?? 0,
});

/**
 * @param query
 * @param keys
 * @example 'isFavorite:asc,name:desc'
 */
export const buildSortForMongo = (query: string, keys: string[]) => {
  if (!query) return [];
  const params = query.split(',');
  const sortArray: [string, SortOrder][] = [];
  for (const param of params) {
    const [field, direction] = param.split(':');
    if (!keys.includes(field)) {
      throw new Error('2006');
    }
    if (!['asc', 'desc'].includes(direction)) {
      throw new Error('2008');
    }
    sortArray.push([field, direction as SortOrder]);
  }

  return sortArray;
};
