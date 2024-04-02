import { get } from 'lodash';

export const getUserIdFromRequest = (req: any) => {
  return get(req, ['user', 'sub'], '');
};
