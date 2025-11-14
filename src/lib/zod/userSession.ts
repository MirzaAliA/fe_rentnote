import { z } from "zod";

export const userSession = z.object({
  email: z.email(),
  name: z.string().min(1),
  id: z.string().min(1),
});

export type userSessionType = z.infer<typeof userSession>;
