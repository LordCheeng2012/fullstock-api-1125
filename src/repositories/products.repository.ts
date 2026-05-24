import type { QueryResult } from "pg";
import * as db from "../db/index.ts";
import camelcaseKeys from "camelcase-keys";
import type { Filters } from "../controllers/product.controller.ts";

export interface ProductRow {
  id: number;
  title: string;
  slug: string;
  img_src: string;
  price: number;
  description: string;
  features: string[];
  category_id: number;
  create_at: Date;
  update_at: Date;
}
export type Product = ReturnType<typeof camelcaseKeys<ProductRow>>;

export const getBySlug = async (
  slug: ProductRow["slug"],
  filters: Filters,
): Promise<Product[] | null> => {
  console.log("filtros -> ", filters);
  const { minPrice, maxPrice }: Filters = filters;
  const params: (string | number)[] = [slug];
  const conditions: string[] = [`c.slug = $1`];
  //validar existencia de argumentos

  /*
    comparacion practica -------
        15 =>  [precios]  <= 20 
    -------------------------------
    */

  if (minPrice) {
    params.push(minPrice);
    conditions.push(`p.price >= $${params.length}`);
  }
  if (maxPrice) {
    params.push(maxPrice);
    conditions.push(`p.price <= $${params.length}`);
  }
  console.log(params);

  const results: QueryResult = await db.query<QueryResult>(
    `SELECT p.* FROM Products p 
    INNER JOIN Categories c 
    ON p.category_id = c.id 
    WHERE ${conditions.join(" AND ")}`,
    params,
  );
  return camelcaseKeys(results.rows);
};

export const getById = async (id: ProductRow["id"]) => {
  const results: QueryResult = await db.query<QueryResult>(
    `SELECT * FROM Products Where id = 1$`,
    [id],
  );
  return camelcaseKeys(results.rows);
};

export const getAll = async () => {
  const queryResult: QueryResult = await db.query("SELECT * FROM products");
  const products: ProductRow[] = queryResult.rows;
  return camelcaseKeys(products);
};
