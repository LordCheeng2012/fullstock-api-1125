import type { itemProduct } from "../controllers/cart-item.controler.ts";
import { ApiError } from "../lib/errors.ts";
import * as cartItemRepository from "../repositories/cart-item-repository.ts";
import { isNullOrUndefined } from "../utils/utils.ts";
import * as cartRepository from "../repositories/cart.repository.ts";


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

  export const updateCartItemQuantity = async (
    cartId:number,
    id:number,
    quantity:number
  ): Promise<cartItemRepository.CartItem> =>{

    const itemFind = await  cartItemRepository.findById(id);

    // validar existencia de item -------------

    if( isNullOrUndefined(itemFind) || cartId !== itemFind.cartId ){
      // no existe --------------
    
      throw new ApiError(404,"El item no existe en el carrito");
    }
    //si existe , se puede actualizar ----------

    const updateFind =  await cartItemRepository.updatedQuantity(id,quantity);

    if(isNullOrUndefined(updateFind)){
       // no existe --------------
       throw new ApiError(409,"Error no se pudo completar la operacion");
    }
    // actualizar modificacion general al carrito referenciado -------------
    await cartRepository.touch(cartId);
    return updateFind;


  }

  export const deleteItem = async (cartId:number,id:number ):Promise<void> =>{
    
    const itemFind = await  cartItemRepository.findById(id);

    // validar existencia de item -------------

    if( isNullOrUndefined(itemFind) || cartId !== itemFind.cartId ){
      // no existe --------------
      throw new ApiError(404,"El item no existe en el carrito");
    }
    //si existe , se puede eliminar ----------
    await cartItemRepository.remove(id);
    cartRepository.touch(cartId);



  }