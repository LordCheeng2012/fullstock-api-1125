import type { itemProduct } from "../controllers/cart-item.controler.ts";
import { ApiError } from "../lib/errors.ts";
import * as cartItemRepository from "../repositories/cart-item-repository.ts";
import { isNullOrUndefined } from "../utils/utils.ts";


  export const createCartItem = async (
    cartId: number,
    itemProduct: itemProduct,
  ): Promise<cartItemRepository.CartItem> => {

    //validar si existe el mismo item-cart en el carrito 
     if(!isNullOrUndefined(await cartItemRepository.findByCartdAndProduct(cartId,itemProduct))){
      throw new ApiError(409,"Ya existe el producto en el carrito");
     }

    return (await cartItemRepository.createItem(
      cartId,
      itemProduct,
    )) as cartItemRepository.CartItem;
  };
