import { z } from "zod";

import { followSchema } from "@/schemas/follow";
import { messageSchema } from "@/schemas/message";
import { postSchema } from "@/schemas/post";

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.email(),
  password: z.string(),
  avatar: z.string(),
  onboarded: z.boolean(),
  createdAt: z.date(),
  _count: z.object({
    Followers: z.number(),
    Followings: z.number(),
    Post: z.number(),
  }),
  Post: z.array(postSchema),
  followers: z.array(z.object({ id: z.number(), follower: followSchema })),
  followings: z.array(z.object({ id: z.number(), following: followSchema })),
  rooms: z.array(
    z.object({
      id: z.number(),
      users: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          username: z.string(),
          avatar: z.string(),
        }),
      ),
      messages: z.array(messageSchema),
    }),
  ),
});

const userPartialSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  avatar: z.string(),
  _count: z
    .object({
      Following: z.number(),
    })
    .optional(),
});

export { userSchema, userPartialSchema };
