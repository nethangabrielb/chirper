import z from "zod";

import roomSchema from "@/schemas/room";

export type RoomType = z.infer<typeof roomSchema>;
