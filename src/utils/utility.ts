import { get } from 'lodash';
import { IPageable, IPageableCount } from './common/types';

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
