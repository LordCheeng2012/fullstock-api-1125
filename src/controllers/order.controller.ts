
import * as userService from "../services/user.services.ts";
import { type Request, type Response } from "express";
import { ApiError } from "../lib/errors.ts";
import * as orderService from "../services/order.service.ts";
import { createOrderBodySchema } from "../schemas/body.schemas.ts";
import {idParamSchema} from "../schemas/id-params.schema.ts";
import { isNullOrUndefined } from "../utils/utils.ts";
import { getValidateCart } from "../guards/guards.ts";

export async function createOrder(req: Request, res: Response) {

 const cartId = (await getValidateCart(req)).id;

  const body = createOrderBodySchema.parse(req.body);
  const userId = req.session.userId;
 
  if (userId !== undefined) {
    const user = await userService.getUserById(userId);
    if (user === null) throw new ApiError(401, "Usuario no encontrado");
    body.email = user.email;
  }
  const order = await orderService.createOrder(cartId,body,userId);
  
  req.session.lastOrderId = order.id;
  delete req.session.cartId;

  res.status(201).json({ data: order });
}

export async function getOrder(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
 
  const order = await orderService.getOrderById(id);
 
  if (isNullOrUndefined(order)) {
    throw new ApiError(404, "Orden no encontrada");
  }
 
  const userSessionId = req.session.userId;
  const isOwner = order.userId !== null && order.userId === userSessionId;
  //verifica que el creador de la orden exista y sea el mismo que de la session
  /*
    casos : 
      ° positivos 
        - si la orden tiene user_id (!null) y es igual a la session de usuario entonces es dueño
        
      ° negativos 
      - si la orden no tiene user_id(null)  o la orden no pertenece al usuario logueado o viceversa
      
      practico : cualquier expresion falsa , falsifica al creador
  
  */
  const isJustCreated = req.session.lastOrderId === id;
  // verifica si al orden a consultar  fue creada recientemente ....
  /*
    - casos : 
     ° practico : cualquier id de orden que no sea el que la session guardo cuando el 
     visitante creo la orden, no sera una orden recientemente creada.

     - si en caso el visitante vuelve a crear otra orden si confirmar la anterior, esa orden se pierde.

  */
 
  if (!isOwner && !isJustCreated) {
      
    /*
      - si en caso no se encontro un creador valido  
      y tampoco tenemos una orden creada recientemente
      esta orden no existe.....  o el visitante no crea su orden
    */
    throw new ApiError(404, "Orden no encontrada");
  }
 
  res.json({ data: order });
}