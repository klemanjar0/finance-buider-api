import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export const makeHash = async (data: string) => {
  return await bcrypt.hash(data, saltOrRounds);
};

export const compareHash = async (initial: string, hashed: string) => {
  return await bcrypt.compare(initial, hashed);
};
