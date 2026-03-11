import { z } from "zod";

const PostSchema = z.object({
  content: z
    .string()
    .max(250, { error: "You have exceeded the allowed length of characters." }),
  userId: z.number().optional(),
  imageUrl: z
    .file()
    .refine((file) => {
      if (file) {
        return file.size <= 5 * 1024 * 1024;
      }
    }, "Image exceeds 5MB limit")
    .nullable(),
});

export default PostSchema;
