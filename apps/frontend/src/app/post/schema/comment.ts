import { z } from "zod";

export const newComment = z.object({
  content: z
    .string()
    .max(250, { error: "You have exceeded the allowed length of characters." }),
  userId: z.number().optional(),
  replyId: z.number(),
  imageUrl: z
    .file()
    .refine((file) => {
      if (file) {
        return file.size <= 5 * 1024 * 1024;
      }
    }, "Image exceeds 5MB limit")
    .nullable(),
});
