import { z } from "zod";

export const bookmarkSchema = z.object({
  id: z.number(),
  userId: z.number(),
  postId: z.number(),
});
