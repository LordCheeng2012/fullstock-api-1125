import type { Request } from "express";
import { ApiError } from "../lib/errors.ts";
import * as cartService from "../services/cart.services.ts";
import { isNullOrUndefined } from "../utils/utils.ts";

export const getValidateCart = async (req:Request,isHidrateCart : boolean = false ) => {

  const cartId = req.session.cartId;
   
    if (cartId === undefined || isNullOrUndefined(cartId) 
        && typeof req.session.cartId === "number") {
      throw new ApiError(404, "El carrito no existe");
    }
   
    const cart = isHidrateCart? 
    await cartService.getHydratedCart(cartId) : 
    await  cartService.findById(cartId);
   
    if (isNullOrUndefined(cart)) {
      delete req.session.cartId;
      throw new ApiError(409, "El carrito de la sesión ya no existe");
    }
    return cart;
}
