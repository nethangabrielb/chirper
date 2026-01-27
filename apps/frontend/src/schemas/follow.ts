import { z } from "zod";

export const followSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  avatar: z.string(),
});
