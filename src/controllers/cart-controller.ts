import type { Request, Response } from "express";
 
import { ApiError } from "../lib/errors.ts";
import * as cartService from "../services/cart.services.ts";
import { isNullOrUndefined } from "../utils/utils.ts";
 
export async function getCart(req: Request, res: Response) {
  const cartId = req.session.cartId;
 
  if (cartId === undefined || isNullOrUndefined(cartId)) {
    throw new ApiError(404, "El carrito no existe");
  }
 
  const cart = await cartService.getHydratedCart(cartId);
 
  if (isNullOrUndefined(cart)) {
    delete req.session.cartId;
    throw new ApiError(409, "El carrito de la sesión ya no existe");
  }
 
  res.json({ data: cart,status:"success" });
}