import { z } from "zod";

import { followSchema } from "@/schemas/follow";

export type FollowType = z.infer<typeof followSchema>;
