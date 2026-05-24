import type { PoolClient, QueryResult } from "pg";
import { query as PoolQuery, withTransaction  as transacción} from "./connections/pool/conections.ts";

export const query = async <T extends QueryResult> (querySQl : string,params?: unknown[],client?:PoolClient) :Promise<T> => {
  console.log("Conexion Test con POOL connection ....");
  try {
    const queryResult :QueryResult = await PoolQuery<QueryResult>(querySQl,params,client);
    return queryResult as T;

  } catch (error) {
    console.log("no fue posible conectarse con la BD",error);
     throw Error("no fue posible conectarse con la BD");
  }
}
export const withTransaction = async <T> (fn : (client : PoolClient)=> Promise<T>)=>{
  return transacción(fn);
}