import camelcaseKeys from "camelcase-keys";
import camelCaseKeys from "camelcase-keys";
import * as db from "../db/index.ts";
import type { PoolClient,QueryResult } from "pg";
import type { itemProduct } from "../controllers/cart-item.controller.ts";

//TYPES ::::::::::::::::::
interface CartItemRow {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

interface CartItemWithProductRow extends CartItemRow {
  title: string;
  slug: string;
  price: number;
  img_src: string;
}

export type CartItem = ReturnType<typeof camelcaseKeys<CartItemRow>>;
type CreateCartItemData = Omit<CartItem, "id" | "createdAt" | "updatedAt">;
export type CartItemWithProduct = ReturnType<typeof camelCaseKeys<CartItemWithProductRow>>;
// ::::::::::::::::::::::
export async function createItem(
  itemProduct: CreateCartItemData,
): Promise<CartItem> {

  const { cartId,productId, quantity } = itemProduct;
  const result: QueryResult<CartItemRow> = await db.query(
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
  cart_id: number,
  itemProduct: itemProduct,
  client ? :PoolClient
): Promise<null | CartItem> {
  const { productId } = itemProduct;
  const query: QueryResult<CartItemRow> = await db.query(
    `
    SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2;`,
    [cart_id, productId],client
  );
  return !query.rows[0] ? null : (camelCaseKeys(query.rows[0]) as CartItem);
}
export async function findById(id: number,client ? : PoolClient): Promise<null | CartItem> {
  const findItem: QueryResult<CartItemRow> = await db.query(
    `SELECT * FROM cart_items WHERE id = $1`,
    [id],
    client
  );
  return !findItem.rows[0]
    ? null
    : (camelCaseKeys(findItem.rows[0]) as CartItem);
}

export async function updatedQuantity(
  id: number,
  quantity: number,
  client?:PoolClient
): Promise<null | CartItem> {
  const sentence: QueryResult<CartItemRow> = await db.query(
    `UPDATE cart_items SET quantity = $2, update_at = NOW() WHERE id = $1 RETURNING *`,
    [id, quantity],
    client
  );
  return !sentence.rows[0]
    ? null
    : (camelCaseKeys(sentence.rows[0]) as CartItem);
}

export async function remove(id: number): Promise<void> {
  await db.query(`DELETE FROM cart_items WHERE id = $1`, [id]);
}

export async function getItemsWithProductByCartId(
  cart_id: number,
): Promise<CartItemWithProduct[] | []> {
  const result: QueryResult<CartItemWithProductRow> = await db.query(
    `
    SELECT ci.*,p.title,p.slug,p.img_src,p.price FROM cart_items as ci
    INNER JOIN products as p
    ON p.id = ci.product_id
    WHERE ci.cart_id = $1 
    ORDER BY ci.create_at ASC; 
    `,
    [cart_id],
  );
  return !result.rows
    ? []
    : (camelCaseKeys(result.rows) as CartItemWithProduct[]);
}

export async function moveToCart(
  id: number,
  cartId: number,
  client?: PoolClient,
): Promise<void> {
  await db.query(
    "UPDATE cart_items SET cart_id = $1 WHERE id = $2",
    [cartId, id],
    client,
  );
}

export async function getByCartId(
  cartId: number,
  client?: PoolClient,
): Promise<CartItem[]> {
  const result = await db.query<QueryResult<CartItemRow>>(
    "SELECT * FROM cart_items WHERE cart_id = $1",
    [cartId],
    client,
  );
 
  return camelcaseKeys(result.rows);
}