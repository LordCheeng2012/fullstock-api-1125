import * as cartRepository from "../repositories/cart.repository.ts"
import type { Cart } from "../repositories/cart.repository.ts";
import type { hydrateCartItem } from "./cart-item.service.ts";
import * as cartItemService from "./cart-item.service.ts"
//Types ::::::::::::::

export interface HydratedCart {
  id: number;
  createAt: Date;
  updatedAt: Date;
  items: hydrateCartItem[];
  totalQuantity: number;
  totalPrice: number;
}

export const create = async () : Promise<Cart> =>{
return  await cartRepository.create() as Cart;
}
export const findById = async (id:number) : Promise<Cart | null> =>{
return await cartRepository.findById(id) as Cart | null;
}

export const getHydratedCart = async (
  id: number,
): Promise<HydratedCart | null> => {
  const cart = await cartRepository.findById(id);
 
  if (cart === null) return null;
 
  const items = await cartItemService.getHydratedItemsByCartId(id);
 
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.lineTotal, 0);
 
  return { ...cart, items, totalQuantity, totalPrice } as HydratedCart ;
}
