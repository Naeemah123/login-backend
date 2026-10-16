import User from './auth.model.js';
import { Exception } from '../../core/error/error.service.js';

type CreateUserData = {
  email: string;
  password: string;
  role: string;
};

export class AuthRepository {
  async findByEmail(email: string) {
    return User.findOne({ email }).lean().exec();
  }

  async findByEmailWithStatus(email: string) {
    return User.findOne({ email })
      .select('email role isDelete isSuspend')
      .lean()
      .exec();
  }

  async findByEmailForLogin(email: string) {
    return User.findOne({ email })
      .select('password email role isDelete isSuspend')
      .lean()
      .exec();
  }

  async createUser(userData: CreateUserData) {
    try {
      return await User.create(userData);
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        err.code === 11000
      ) {
        throw new Exception(409, 'Similar record already exist');
      }

      throw err;
    }
  }
}

export const authRepository = new AuthRepository();
