import * as z from "zod";
 
export const authBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
 
export type AuthBody = z.infer<typeof authBodySchema>;