import z from "zod";

import { userPartialSchema, userSchema } from "@/schemas/user";

export type User = z.infer<typeof userSchema>;

export type UserPartial = z.infer<typeof userPartialSchema>;
