import  camelcaseKeys from "camelcase-keys";
import camelCaseKeys from "camelcase-keys";
import * as db from "../db/index.ts";
import type { PoolClient, QueryResult } from "pg";


interface CartRow {
id:number,
user_id: number | null;
create_at:Date,
updated_at:Date
}

export type Cart = ReturnType<typeof camelcaseKeys<CartRow>> 

export async function create(user_id?:CartRow["user_id"]): Promise<Cart> {
  const result :QueryResult = await db.query(
    "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
    [user_id??null]
  );
  if (result.rows[0] === undefined)
    throw new Error("No se pudo crear el carrito , no hubo una respuesta esperada del servidor");
  return  camelCaseKeys(result.rows[0]) as Cart;
}
export async function findById(id: number): Promise<Cart | null> {
  const query:QueryResult = await db.query("SELECT * FROM carts WHERE id = $1", [id]);
  const result :CartRow =  query.rows[0];
  return result !== undefined ? camelcaseKeys(result) as Cart : null;
}
export async function touch(id:number): Promise<void> {
await db.query(`UPDATE carts SET update_at = NOW() WHERE id = $1`,[id]);  
}
export async function remove(cartId:number,client?: PoolClient): Promise<void>  {
  console.log("eliminando carrito con id -> ........... ",cartId);
  console.log("Eliminando ......")
  await db.query(`DELETE FROM carts WHERE id = $1`,[cartId],client);
  console.log("se elimino carrito ----")
}
export async function linkToUser(
  cartId: number,
  userId: number,
): Promise<void> {
  await db.query("UPDATE carts SET user_id = $1 WHERE id = $2", [
    userId,
    cartId,
  ]);
}
export async function findByUserId(userId: number): Promise<Cart | null> {
  const result = await db.query<QueryResult<CartRow>>(
    "SELECT * FROM carts WHERE user_id = $1",
    [userId],
  );
 
  return result.rows[0] !== undefined ? camelcaseKeys(result.rows[0]) : null;
}