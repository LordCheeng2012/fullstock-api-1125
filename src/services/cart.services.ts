import * as cartRepository from "../repositories/cart.repository.ts"
import type { Cart } from "../repositories/cart.repository.ts";

export const create = async () : Promise<Cart> =>{
return  await cartRepository.create() as Cart;
}
export const findById = async (id:number) : Promise<Cart | null> =>{
return await cartRepository.findById(id) as Cart | null;

}
