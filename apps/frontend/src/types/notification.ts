import { z } from "zod";

import { notificationSchema } from "@/schemas/notification";

export type Notification = z.infer<typeof notificationSchema>;
