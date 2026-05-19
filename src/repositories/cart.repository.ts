import  camelcaseKeys from "camelcase-keys";
import camelCaseKeys from "camelcase-keys";
import * as db from "../db/index.ts";
import type { QueryResult } from "pg";

interface CartRow {
id:number,
create_at:Date,
updated_at:Date
}

export type Cart = ReturnType<typeof camelcaseKeys<CartRow>> 


export async function create(): Promise<Cart> {
  const result :QueryResult = await db.query(
    "INSERT INTO carts DEFAULT VALUES RETURNING *",
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