import type { Filters } from "../controllers/product.controller.ts";
import * as productRepository from "../repositories/products.repository.ts";
import type {
  ProductRow,
  Product,
} from "../repositories/products.repository.ts";
import { isNullOrUndefined } from "../utils/utils.ts";

export const getProductsByCategorySlug = async (
  slug: ProductRow["slug"],
  filters: Filters,
): Promise<Product[] | null> => {
  return await productRepository.getBySlug(slug, filters);
};

export const getProductBySlug = async (
  slug: ProductRow["slug"],
): Promise<Product | null | undefined> => {
  const products: Product[] = await productRepository.getAll();
  console.log("products http -> ", products);
  const productFind: Product | undefined = products.find(
    (product) => product.slug === slug,
  );
  return !isNullOrUndefined(productFind) ? productFind : null;
};
