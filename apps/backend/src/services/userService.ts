import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UserRepository from '../repositories/userRepository';
import type { LoginBody, RegistrationBody } from '../types/auth';

const LOGIN_ERR_MESSAGE = 'Invalid username or password. Please try again.';

const UserService = {
  createNewUser: async (data: RegistrationBody) => {
    const encryptedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await UserRepository.createNewUser({
      ...data,
      password: encryptedPassword,
      avatar:
        'https://bcezmxfxuctgrkiavycl.supabase.co/storage/v1/object/public/images/default.svg',
    });

    if (!newUser) {
      throw new Error('There was an unexpected error creating the account.');
    }
    return newUser;
  },
  loginUser: async (data: LoginBody) => {
    // check if username exists
    const user = await UserRepository.findByUsername(data.username);
    if (!user) {
      throw new Error(LOGIN_ERR_MESSAGE);
    }

    // validate if password is correct
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error(LOGIN_ERR_MESSAGE);
    }

    // create new token
    const token = jwt.sign(user, process.env.JWT_SECRET!);

    // return token
    return token;
  },
  getUserById: async (id: number) => {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  },

  getAllUsers: async () => {
    return UserRepository.findAll();
  },

  getUserChatList: async (
    id: number,
    followings: Array<{
      id: number;
      following: {
        name: string;
        username: string;
        avatar: string | null;
        id: number;
      };
    }>
  ) => {
    const followingIds = followings.map(following => following.following.id);
    return UserRepository.findUsersChatList(id, followingIds);
  },

  getUserSearchResults: async (name: string) => {
    const users = await UserRepository.findByName(name);
    if (!users) throw new Error('Failed to fetch users');
    return users;
  },

  updateUser: async (id: number, data: Partial<RegistrationBody>) => {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    if (data.onboarded) {
      data.onboarded = String(data.onboarded) === 'true';
    }
    return UserRepository.updateById(id, data);
  },

  deleteUser: async (id: number) => {
    return UserRepository.deleteById(id);
  },

  getUserByUsername: async (username: string) => {
    const user = await UserRepository.findByUsername(username);
    return user;
  },

  getUserByEmail: async (email: string) => {
    const user = await UserRepository.findByEmail(email);
    return user;
  },

  getFollowLists: async (userId: number) => {
    const users = await UserRepository.findFollowingList(userId);
    if (!users) {
      throw new Error('Failed to fetch follow list');
    }
    return users;
  },
};

export default UserService;
