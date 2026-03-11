import { decode } from 'base64-arraybuffer';

import commentRepository from '../repositories/commentRepository';
import postRepository from '../repositories/postRepository';
import { client } from '../supabase/client';
import { CommentBody } from '../types/comment';

const commentService = {
  createComment: async (
    commentData: CommentBody,
    file: Express.Multer.File | null
  ) => {
    // Find the post it is replying to
    const post = await postRepository.findById(commentData.replyId);

    if (post?.deleted) {
      return 'deleted';
    }

    if (file) {
      // decode buffer to base64 string
      const base64 = file.buffer.toString('base64');

      // upload file image
      const { data, error } = await client.storage
        .from('images')
        .upload(
          `${commentData.userId}-postImage-${Date.now().toString()}-${crypto.randomUUID()}`,
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

      commentData = {
        ...commentData,
        imageUrl: image.publicUrl,
        userId: Number(commentData.userId),
        replyId: Number(commentData.replyId),
      };
    }

    const comment = await commentRepository.create(commentData);
    if (!comment) throw new Error('There was an issue creating comment');
    return comment;
  },

  getComment: async (commentId: number) => {
    const comment = await commentRepository.findById(commentId);
    if (!comment) throw new Error('Comment not found');
    return comment;
  },
  deleteComment: async (commentId: number) => {
    return commentRepository.deleteById(commentId);
  },
};

export default commentService;
