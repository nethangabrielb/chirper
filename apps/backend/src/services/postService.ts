import { decode } from 'base64-arraybuffer';

import postRepository from '../repositories/postRepository';
import { client } from '../supabase/client';
import { Post } from '../types/post';

const postService = {
  createPost: async (post: Post, file: Express.Multer.File | null) => {
    let updatedPost: Post;

    if (file) {
      // decode buffer to base64 string
      const base64 = file.buffer.toString('base64');

      // upload file image
      const { data, error } = await client.storage
        .from('images')
        .upload(
          `${post.userId}-postImage-${Date.now().toString()}-${crypto.randomUUID()}`,
          decode(base64),
          {
            cacheControl: '3600',
            contentType: file.mimetype,
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

      updatedPost = {
        ...post,
        imageUrl: image.publicUrl,
        userId: Number(post.userId),
      };
    } else {
      updatedPost = {
        ...post,
        userId: Number(post.userId),
      };
    }

    console.log(updatedPost);

    const newPost = await postRepository.create(updatedPost);
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
  getPosts: async () => {
    // fetch posts
    const posts = await postRepository.findAll();

    if (!posts) {
      throw new Error('There was a problem fetching posts');
    }

    return posts;
  },
  getPostsCursorPagination: async (cursor: number) => {
    const posts = await postRepository.findAllByCursor(cursor);

    if (!posts) {
      throw new Error('There was a problem fetching posts');
    }

    return posts;
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
  getPostsByFollowingInitial: async (userId: number) => {
    const posts = await postRepository.findByFollowing(userId);
    if (!posts) {
      throw new Error('There was a problem fetching posts');
    }
    return posts;
  },
  getPostsByFollowing: async (userId: number, cursor: number) => {
    const posts = await postRepository.findByFollowingCursor(userId, cursor);
    if (!posts) {
      throw new Error('There was a problem fetching posts');
    }
    return posts;
  },
};

export default postService;
