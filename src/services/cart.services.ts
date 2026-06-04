import * as cartRepository from "../repositories/cart.repository.ts"
import type { Cart } from "../repositories/cart.repository.ts";
import type { hydrateCartItem } from "./cart-item.service.ts";
import * as cartItemService from "./cart-item.service.ts";
import * as db from "../db/index.ts";
import * as cartItemRepository from "../repositories/cart-item-repository.ts"
//Types ::::::::::::::

export interface HydratedCart {
  id: number;
  createAt: Date;
  updatedAt: Date;
  items: hydrateCartItem[];
  totalQuantity: number;
  totalPrice: number;
}

export const create = async (userId? : Cart["userId"]) : Promise<Cart> =>{
  console.log("usuario" , userId);
return  await cartRepository.create(userId) as Cart;
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

export async function resolveCartId(
  visitorCartId: number | undefined,
  userId: number,
): Promise<number | undefined> {

  /*
  recibimos el carrit visitante ::::::::::::::
  recibimos el userID de la session creada o registrada como nuevo usuario
  */

 
 /* obtenemos el carrito del usuario logueado o creado */
 
 const userCart = await cartRepository.findByUserId(userId);
 
 /* ________________verificaciones ________________________ */
 /* 1.  verificamos carrito anonimo */

   if (visitorCartId === undefined) {
     /*
     -  si en caso el carrito anonimo no existe retorna undefined
       entonces, cuando se crea el carrito, el usuario sera null, 
       por logica del metodo createCart en repository ,indicando que el carrito es anonimo
   
     - si existe entonces retorna el id y el nuevo carrito o al agregar el item, ya tendra el usuario
       vinculado  
     */ 
     return userCart?.id;  /*  userID | undefined === null in DB */
  }

  /* 2. verificamos el carrito del usuario   */

  if (userCart === null) {
    /*
     si no hay carrito de usario en la bd, entonces .
     - vincular el nuevo usuario al carrito anonimo en la db
    */
    await cartRepository.linkToUser(visitorCartId, userId);
    return visitorCartId;
  }

  /*
  si en caso user cart exite en la DB , y el carrito existe carrito anonimo 
  entonces realizar la fusion de carritos y retornar el usuario con sus carrito mergeados.

  
  */
  await mergeVisitorCartIntoUserCart(visitorCartId, userCart.id);
  return userCart.id;
}

async function mergeVisitorCartIntoUserCart(
  visitorCartId: number,
  userCartId: number,

): Promise<void> {
  
  await db.withTransaction(async (client) => {

    const visitorItems = await cartItemRepository.getByCartId(visitorCartId,client);
    console.log("obteniendo items del carrito anonimo ------ ",visitorCartId);

    
    /*
      1. se obtienen todos los items del carrito anonimo y se itera por cada una de ellas 
    */

      console.log("iterando items ----------------- ")
    for (const visitorItem of visitorItems) {
      console.log("obteniendo info del item con producto de : -> ",visitorItem.productId);
      console.log("En el carrito de usuario --> ", userCartId);

      const existingItemInUserCart = await cartItemRepository.findByCartdAndProduct(
        userCartId,
        visitorItem,
        client,
      );

      console.log(`resultado de busqueda de item 
        com producto de ${visitorItem.productId} fue -> `,existingItemInUserCart);

      if (existingItemInUserCart === null) {
        console.log("No existe item --------- ");
        console.log("asignando el item al carrito del usuario : ", userCartId);
        await cartItemRepository.moveToCart(visitorItem.id, userCartId, client);
        console.log("se linkeo el item al nuevo carrito de usuario");
        /*
          al no existir el item del carrito anonimo  en el carrito del usuario, :: {a}[p] --- {u}[] 
          la funcion moveToCart realiza : 
            - desvincula o quita  el cart_id del carrito anonimo al item   ::: {a}[] --- {u}[]  :: p ::
            - establece como nuevo cart_id el cart_id del usuario  :: {a}[] --> {u}[p]
        
        */
      } else {
        console.log("existe item en ambos carritos , se realiza sumatoria de cantidades");
        console.log("agregnado cantidad ")
        await cartItemRepository.updatedQuantity(
          existingItemInUserCart.id,
          existingItemInUserCart.quantity + visitorItem.quantity,
          client,
        );
        console.log("se actualizo cantidad ")
        /*
          si en caso el item anonimo, ya existia en el carrito de usuario : 
          :: 
               {a}[p] <------> {u}[p] 
          
         simplemente hay que sumar ambas cantidades de productos, el metodo 
         updateQuantity exige el id del item ,mas la nueva cantidad (
         alli mismo debemos pasarle el item del usuario y pasarle la suma con de la cantidades del item 
         anonimo y la del usaurio

         :: {a}[] ------- > {u}[p*2]

         )
          tener en cuenta que la nueva cantidad la tendra el carrito del usuario, ya que el tendra la session
          persistente del usaurio.
                
        */
      }

    }
    console.log("remove llego ")

    await cartRepository.remove(visitorCartId, client);

    console.log("remove finalize")
    /*
      finalmente , se elimian el carrito anonimo ya que no tiene sentido
       guardarlo si todo ya esta en el carrito del usaurio.

       :: delete -> xxxx {a}[] xxxx

    */
  });
}