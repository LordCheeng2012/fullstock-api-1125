import * as z from "zod";
 
export const createCartItemBodySchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1),
});
 
export const updateCartItemBodySchema = z.object({
  quantity: z.number().int().min(1),
});
export type CreateCartItemBody = z.infer<typeof createCartItemBodySchema>;