import * as bcrypt from 'bcrypt';

export const makeHash = async (data: string) => {
  return await bcrypt.hash(data, 10);
};

export const compareHash = async (initial: string, hashed: string) => {
  return await bcrypt.compare(initial, hashed);
};
