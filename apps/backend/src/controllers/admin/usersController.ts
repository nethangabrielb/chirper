import { Request, Response } from 'express';

import { decode } from 'base64-arraybuffer';
import _ from 'lodash';

import followRepository from '../../repositories/followRepository';
import roomService from '../../services/roomService';
import UserService from '../../services/userService';
import { client } from '../../supabase/client';
import type { RegistrationBody } from '../../types/auth';
import { User } from '../../types/user';
import { GENERIC_ERROR_MESSAGE } from '../../utils/errorMessage';

const userController = (() => {
  const getUser = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const user = await UserService.getUserById(Number(req.params.id));
      return res.status(200).json({ status: 'success', data: user });
    } catch (err: unknown) {
      return res.status(err instanceof Error ? 404 : 500).json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const getAllUsers = async (_req: Request, res: Response) => {
    try {
      const user: User = _req.user as User;
      if (_req.query.current) {
        const followers = await followRepository.findFollowers(user.id);
        const followings = await followRepository.findFollowings(user.id);
        const rooms = await roomService.getUserRooms(user.id);
        const modifiedUser = {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          onboarded: user.onboarded,
          followers,
          followings,
          rooms,
        };
        return res.json({ status: 'success', data: modifiedUser });
      } else if (_req.query.chatUsersList) {
        const followings = await followRepository.findFollowings(user.id);

        if (!followings) {
          return res.json({
            status: 'error',
            message: 'Failed to fetch user ',
          });
        }

        const followingsUpdated = followings.map(
          following => following.following
        );

        const users = await UserService.getUserChatList(user.id, followings);

        if (!users) {
          return res.json({
            status: 'error',
            message: 'Failed to fetch users',
          });
        }

        const usersArray = _.concat(followingsUpdated, users);

        return res.json({ status: 'success', data: usersArray });
      } else if (_req.query.user) {
        const users = await UserService.getUserSearchResults(
          _req.query.user as string
        );

        if (!users) {
          return res.json({
            status: 'error',
            message: 'Failed to fetch users',
          });
        }

        return res.json({ status: 'success', data: users });
      } else if (_req.query.list === 'followList') {
        let users;
        const currentUser = _req.user as User;
        if (_req.query.limit) {
          users = await UserService.getFollowListsLimit(
            currentUser.id,
            Number(_req.query.limit)
          );

          if (!users) {
            throw new Error('Failed to fetch users');
          }

          return res.json({
            status: 'success',
            data: users,
          });
        } else if (_req.query.page) {
          const pageParam = Number(_req.query.page);
          users = await UserService.getFollowLists(currentUser.id, pageParam);

          if (!users) {
            throw new Error('Failed to fetch users');
          }

          return res.json({
            status: 'success',
            data: { data: users, nextPage: Number(_req.query.page) + 1 },
          });
        }
      } else {
        const users = await UserService.getAllUsers();
        return res.json({ status: 'success', data: users });
      }
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const updateUser = async (
    req: Request<{ id: string }, object, Partial<RegistrationBody>>,
    res: Response
  ) => {
    try {
      // check if there is file
      if (req.file) {
        // decode buffer to base64 string
        const base64 = req.file.buffer.toString('base64');

        // upload file
        const { data, error } = await client.storage
          .from('images')
          .upload(
            `${req.body.username}-avatar-${Date.now().toString()}`,
            decode(base64),
            {
              cacheControl: '3600',
              contentType: req.file.mimetype,
              upsert: false,
            }
          );

        if (error) {
          throw new Error('There was an error processing the form.');
        }

        // get the file public link
        const { data: image } = client.storage
          .from('images')
          .getPublicUrl(data.path);

        req.body = { ...req.body, avatar: image.publicUrl };
      }

      const updatedUser = await UserService.updateUser(
        Number(req.params.id),
        req.body
      );
      return res.json({ status: 'success', data: updatedUser });
    } catch (err: unknown) {
      return res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
    try {
      await UserService.deleteUser(Number(req.params.id));
      res.json({ status: 'success', message: 'User deleted' });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const getAvailability = async (
    req: Request<
      { username: string },
      object,
      object,
      { property: 'username' | 'email'; value: string }
    >,
    res: Response
  ) => {
    try {
      let user: null | User = null;
      const propertyToCheck = req.query.property;
      const value = req.query.value;

      // check either username or email of it is taken
      if (propertyToCheck === 'username') {
        user = await UserService.getUserByUsername(value);
      } else if (propertyToCheck === 'email') {
        user = await UserService.getUserByEmail(value);
      }

      if (user) {
        res.json({ status: 'error', message: 'already taken' });
      } else {
        res.status(404).json({ status: 'success', message: 'not taken' });
      }
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  return {
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getAvailability,
  };
})();

export default userController;
