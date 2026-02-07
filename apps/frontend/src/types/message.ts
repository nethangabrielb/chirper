import z from "zod";

import { messageSchema } from "@/schemas/message";

export type MessageType = z.infer<typeof messageSchema>;
