import * as cartService from "../services/cart.services.ts";
import { type Request, type Response } from "express";
import { ApiError } from "../lib/errors.ts";
import * as orderService from "../services/order.service.ts";
import { createOrderBodySchema } from "../schemas/body.schemas.ts";
export async function createOrder(req: Request, res: Response) {
  const cartId = req.session.cartId;

  if (cartId === undefined) {
    throw new ApiError(400, "El carrito no existe");
  }

  const cart = await cartService.findById(cartId);

  if (cart === null) {
    delete req.session.cartId;
    throw new ApiError(409, "El carrito de la sesión ya no existe");
  }

  const body = createOrderBodySchema.parse(req.body);

  const order = await orderService.createOrder(cartId, body);

  delete req.session.cartId;

  res.status(201).json({ data: order });
}
