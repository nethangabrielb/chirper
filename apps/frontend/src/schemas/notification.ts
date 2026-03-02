import { z } from "zod";

export const notificationSchema = z.object({
  id: z.number(),
  receiverId: z.number(),
  content: z.string(),
  createdAt: z.date(),
});
