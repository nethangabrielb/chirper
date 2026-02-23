import { z } from "zod";

import { bookmarkSchema } from "@/schemas/bookmark";
import { replySchema } from "@/schemas/reply";

export const userSchema = z.object({
  avatar: z.string(),
  username: z.string(),
  name: z.string(),
  id: z.number(),
  _count: z.object({
    Followers: z.number(),
    Followings: z.number(),
    Post: z.number(),
  }),
});

export const likeSchema = z.object({
  userId: z.number(),
});

export const postSchema = z.object({
  id: z.number(),
  replyId: z.number(),
  userId: z.number(),
  content: z.string(),
  createdAt: z.date(),
  deleted: z.boolean(),
  user: userSchema,
  _count: z.object({
    Like: z.number(),
    replies: z.number(),
  }),
  Like: z.array(likeSchema),
  replies: z.array(replySchema),
  reply: replySchema.optional(),
  bookmarks: z.array(bookmarkSchema),
});
