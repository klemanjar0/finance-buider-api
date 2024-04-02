import * as process from 'process';

export const getJWTSeed = () => {
  return process.env.JWT_SEED || 'fallback_seed!';
};

export const getJWTLifetime = () => {
  return process.env.JWT_LIFETIME || '15m';
};
