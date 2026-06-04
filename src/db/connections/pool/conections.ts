import { env } from "../../../env.ts";
import { Pool, type PoolClient, type QueryResultRow } from "pg";

export  const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export function query<T extends QueryResultRow>(
  text: string,
  params?: unknown[],
  client?:PoolClient
) {
  const runner = client ?? pool;
  console.log("Ejecutando la siguiente sentencia: ", text);
  return runner.query<T>(text, params);
}

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // el callback ejecutará las operaciones de la transacción usando el mismo `client`
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}