import followRepository from '../repositories/followRepository';
import type { Follow } from '../types/follow';
import type { User } from '../types/user';

const FollowService = {
  createNewFollow: async (follow: Follow) => {
    const newFollow = await followRepository.create(follow);
    if (!newFollow) {
      throw new Error('Error following user. Please try again');
    }
    return newFollow;
  },
  getUserFollows: async (userId: number) => {
    const followings: Array<{ following: Partial<User> }> =
      await followRepository.findFollowings(userId);

    const followers: Array<{ follower: Partial<User> }> =
      await followRepository.findFollowers(userId);

    if (!followings || !followers) {
      throw new Error(
        'There was an error fetching data in the database. Please try again'
      );
    }
    return { followers, followings };
  },
  getUserFollowers: async (userId: number) => {
    const followers: Array<{ follower: Partial<User> }> =
      await followRepository.findFollowers(userId);

    if (!followers) {
      throw new Error(
        'There was an error fetching data in the database. Please try again'
      );
    }
    return followers;
  },
  getUserFollowings: async (userId: number) => {
    const followings: Array<{ following: Partial<User> }> =
      await followRepository.findFollowings(userId);

    if (!followings) {
      throw new Error(
        'There was an error fetching data in the database. Please try again'
      );
    }
    return followings;
  },
  deleteFollow: async (followId: number) => {
    return followRepository.deleteById(followId);
  },
};

export default FollowService;
