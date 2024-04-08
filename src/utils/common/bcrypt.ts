import * as bcrypt from 'bcrypt';

const salt = '$2b$10$fNPFzVntNxFM.bR2KXzzD.';

export const makeHash = async (data: string) => {
  return await bcrypt.hash(data, salt);
};

export const compareHash = async (initial: string, hashed: string) => {
  return await bcrypt.compare(initial, hashed);
};
//
