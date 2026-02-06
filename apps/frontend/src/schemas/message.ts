import { z } from "zod";

export const messageSchema = z.object({
  id: z.number(),
  content: z.string(),
  createdAt: z.date(),
  roomId: z.number(),
  receiverId: z.number(),
  senderId: z.number(),
  loading: z.boolean().optional(),
  tempId: z.string().optional(),
});
