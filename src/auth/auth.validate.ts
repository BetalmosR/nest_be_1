import * as bcrypt from 'bcrypt';

export const hashPassword = async (
  password: string,
  salt: string,
): Promise<string> => {
  return bcrypt.hash(password, salt);
};

export const validatePassword = async (
  password: string,
  userPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, userPassword);
};
