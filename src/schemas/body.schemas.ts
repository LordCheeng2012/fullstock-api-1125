import * as z from "zod";
 
export const createOrderBodySchema = z.object({
  email: z.email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  company: z.string().min(1).nullable().optional().default(null),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  region: z.string().min(1),
  zipCode: z.string().min(1),
  phone: z.string().min(1),
});
 
export type CreateOrderBody = z.infer<typeof createOrderBodySchema>;