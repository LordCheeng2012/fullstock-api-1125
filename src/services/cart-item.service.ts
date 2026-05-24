
import { ApiError } from "../lib/errors.ts";
import * as cartItemRepository from "../repositories/cart-item-repository.ts";
import { isNullOrUndefined } from "../utils/utils.ts";
import * as cartRepository from "../repositories/cart.repository.ts";
import type { CreateCartItemBody } from "../schemas/cart-item.schema.ts";

//Types ::::::::::::::::::::::

export interface hydrateCartItem
extends
    Omit<cartItemRepository.CartItem, "productId">,
    Omit<cartItemRepository.CartItem, "cartId">,
    Omit<cartItemRepository.CartItem, "createdAt">,
    Omit<cartItemRepository.CartItem, "updatedAt"> 
{
  lineTotal: number;
  product: {
    id: number;
    title: string;
    slug: string;
    price: number;
    imgSrc: string;
  };
}

export const createCartItem = async (
  cartId: number,
  itemProduct: CreateCartItemBody,
): Promise<cartItemRepository.CartItem> => {
  //validar si existe el mismo item-cart en el carrito
  if (
    !isNullOrUndefined(await cartItemRepository.findByCartdAndProduct(cartId, itemProduct))
  ) {
    throw new ApiError(409, "Ya existe el producto en el carrito");
  }

  return (await cartItemRepository.createItem({cartId,...itemProduct})) as cartItemRepository.CartItem;
};
export const updateCartItemQuantity = async (
  cartId: number,
  id: number,
  quantity: number,
): Promise<cartItemRepository.CartItem> => {
  const itemFind = await cartItemRepository.findById(id);

  // validar existencia de item -------------

  if (isNullOrUndefined(itemFind) || cartId !== itemFind.cartId) {
    // no existe --------------

    throw new ApiError(404, "El item no existe en el carrito");
  }
  //si existe , se puede actualizar ----------

  const updateFind = await cartItemRepository.updatedQuantity(id, quantity);

  if (isNullOrUndefined(updateFind)) {
    // no existe --------------
    throw new ApiError(409, "Error no se pudo completar la operacion");
  }
  // actualizar modificacion general al carrito referenciado -------------
  await cartRepository.touch(cartId);
  return updateFind;
};
export const deleteItem = async (cartId: number, id: number): Promise<void> => {
  const itemFind = await cartItemRepository.findById(id);

  // validar existencia de item -------------

  if (isNullOrUndefined(itemFind) || cartId !== itemFind.cartId) {
    // no existe --------------
    throw new ApiError(404, "El item no existe en el carrito");
  }
  //si existe , se puede eliminar ----------
  await cartItemRepository.remove(id);
  cartRepository.touch(cartId);
};
export async function getHydratedItemsByCartId(
  cartId: number,
): Promise<hydrateCartItem[]> {
  const rows = await cartItemRepository.getItemsWithProductByCartId(cartId);
  return rows.map((row) => ({
    id: row.id,
    quantity: row.quantity,
    lineTotal: row.quantity * row.price,
    product: {
      id: row.productId,
      title: row.title,
      slug: row.slug,
      price: row.price,
      imgSrc: row.imgSrc,
    },
  })) as hydrateCartItem[];
}
