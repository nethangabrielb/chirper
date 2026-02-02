import z from "zod";

const roomSchema = z.object({
  id: z.number(),
  users: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      username: z.string(),
    }),
  ),
});

export default roomSchema;
