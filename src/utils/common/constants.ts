import * as process from 'process';

export const getJWTSeed = () => {
  return process.env.JWT_SEED;
};
