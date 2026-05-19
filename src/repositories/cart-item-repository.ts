import camelcaseKeys from "camelcase-keys";
import camelCaseKeys from "camelcase-keys";
import * as db from "../db/index.ts";
import type { QueryResult } from "pg";
import type { itemProduct } from "../controllers/cart-item.controler.ts";

interface CartItemRow {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export type CartItem = ReturnType<typeof camelcaseKeys<CartItemRow>>;

export async function createItem(
  cartId: number,
  itemProduct: itemProduct,
): Promise<CartItem> {
  const { productId, quantity } = itemProduct;
  const result: QueryResult = await db.query(
    `INSERT INTO cart_items (cart_id, product_id, quantity)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [cartId, productId, quantity],
  );
  if (result.rows[0] === undefined)
    throw new Error("Insercion no devolvio una fila");
  return camelCaseKeys(result.rows[0]) as CartItem;
}
export async function findByCartdAndProduct(
  cart_id:number,
  itemProduct:itemProduct)
  :Promise<null|CartItem> {

  const {productId} = itemProduct;
  const query: QueryResult = await db.query(`
    SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2;`,[
    cart_id,  
    productId  
    ]);
  return !query.rows[0] ? null : camelCaseKeys(query.rows[0]) as CartItem;
}