import * as bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPasswordHelper = (plainPassword: string): Promise<string> =>
  bcrypt.hash(plainPassword, saltRounds);

export const comparePasswordHelper = async (
  plainPassword: string,
  hashPassword: string,
): Promise<boolean> => bcrypt.compare(plainPassword, hashPassword);
