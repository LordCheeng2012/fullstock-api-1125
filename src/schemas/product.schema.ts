import * as z from "zod";
 
export const getProductsQuerySchema = z.object({
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
});
 
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;