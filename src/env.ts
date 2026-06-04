import * as z from "zod";
 
const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
  SESSION_SECRET_STATE:z.string().min(1)
});
 
const parsed = envSchema.safeParse(process.env);
 
if (!parsed.success) {
  console.error("---------- [ERROR] : Fallo al iniciar la Applicacion ---------");
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}
 
export const env = parsed.data;