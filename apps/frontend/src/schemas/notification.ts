import { z } from "zod";

export const notificationSchema = z.object({
  id: z.number(),
  receiverId: z.number(),
  content: z.string(),
  createdAt: z.date(),
  senderId: z.number(),
  sender: z.object({
    id: z.number(),
    avatar: z.string(),
    username: z.string(),
    name: z.string(),
  }),
  post: z.object({
    content: z.string(),
    deleted: z.boolean(),
  }),
  postId: z.number().optional(),
});
