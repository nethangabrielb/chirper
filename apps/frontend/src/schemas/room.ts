import z from "zod";

import { messageSchema } from "@/schemas/message";

const roomSchema = z.object({
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
});

export default roomSchema;
