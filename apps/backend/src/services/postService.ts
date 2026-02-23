import _ from 'lodash';

import followRepository from '../repositories/followRepository';
import postRepository from '../repositories/postRepository';
import { Post } from '../types/post';
import { User } from '../types/user';

const postService = {
  createPost: async (data: Post) => {
    const newPost = await postRepository.create(data);
    if (!newPost) {
      throw new Error('There was a problem making a post');
    }
    return newPost;
  },
  getPost: async (postId: number) => {
    const post = await postRepository.findById(postId);
    if (!post) {
      throw new Error('There was a problem fetching the post');
    }
    return post;
  },
  getPosts: async (user: User) => {
    // fetch the followings of the user
    const followings = await followRepository.findFollowings(user.id);

    //  get the id's of all the user followings
    const followingIds = followings.map(following => following.following.id);

    // fetch posts
    const posts = await postRepository.findAll();

    if (!posts) {
      throw new Error('There was a problem fetching posts');
    }

    // add an property in following post that distinguishes it from others
    const modifiedPosts = posts.map(post => {
      if (_.includes(followingIds, post.userId)) {
        return { ...post, following: true };
      } else {
        return { ...post, following: false };
      }
    });

    // sort the post so that the posts from followings will show on top
    const sortedPosts = _.orderBy(modifiedPosts, ['following'], ['desc']);

    return sortedPosts;
  },
  deletePost: async (postId: number) => {
    return postRepository.deleteById(postId);
  },
  getUserReplies: async (userId: number) => {
    const posts = await postRepository.findRepliesByUserId(userId);
    if (!posts) {
      throw new Error('There was a problem fetching replies');
    }
    return posts;
  },
  getUserLiked: async (userId: number) => {
    const posts = await postRepository.findLikedPostsByUserId(userId);
    if (!posts) {
      throw new Error('There was a problem fetching liked posts');
    }
    return posts;
  },
  getBookmarkedPosts: async (userId: number) => {
    const posts = await postRepository.findByBookmarked(userId);
    if (!posts) {
      throw new Error('There was a problem fetching bookmarked posts');
    }
    return posts;
  },
};

export default postService;
