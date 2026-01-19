import { z } from "zod";

import { followSchema } from "@/schemas/follow";
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
});

export { userSchema };
