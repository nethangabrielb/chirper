import { z } from "zod";

import { bookmarkSchema } from "@/schemas/bookmark";

export type BookmarkType = z.infer<typeof bookmarkSchema>;
