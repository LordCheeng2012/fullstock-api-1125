import type { Request, Response } from "express";
import { SESSION_COOKIE_NAME, destroySession } from "../lib/session.ts";
import * as cartService from "../services/cart.services.ts"
import { authBodySchema } from "../schemas/auth.schema.ts";
import * as userService from "../services/user.services.ts";
 
export async function createSession(req: Request, res: Response) {
  const { email, password } = authBodySchema.parse(req.body);
 
  /* buscamos el usaurio con las credenciales ---------- */
  const user = await userService.verifyCredentials(email, password);
 
  /*
  si en caso usuario no existe, este servicio arrojara el 401, asi que si no hay
  excepciones, el usuario debe existir 
  */

  // guardamos la session en el storage
  req.session.userId = user.id;
  /*
    ahora definimos el cartID de la session,
    este metodo resuelve el Cartid decide si el cartID es nuevo (crear el carrito), 
    ya existio en el aninimato (asignarle el user al carrito anonimo) o 
    ya ya tenia registrado (merge carts) 
  
  */
  const cartId = await cartService.resolveCartId(req.session.cartId, user.id);
  /*
  si en caso el cartiD es valido se setea a la session
  */ 
  if (cartId !== undefined) {
    req.session.cartId = cartId;
  }
 
  res.status(200).json({ data: user });
}

export async function deleteSession(req: Request, res: Response) {
  await destroySession(req.session);
 
  res.clearCookie(SESSION_COOKIE_NAME);
  res.status(204).send();
}