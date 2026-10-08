import User from './auth.model.js';
export const findByEmail = async (email: string) => {
  return User.findOne({ email });
};

export const createUser = async (userData: {
  email: string;
  password: string;
  role: string;
}) => {
  return User.create(userData);
};