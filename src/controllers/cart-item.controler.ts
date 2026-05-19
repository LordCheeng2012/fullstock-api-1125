import * as cartService from "../services/cart.services.ts";
import * as cartItemService from "../services/cart-item.service.ts";
import type { Request,Response } from "express";
import * as utils from "../utils/utils.ts";
import { ApiError } from "../lib/errors.ts";


export interface itemProduct {
productId:number,
quantity:number
}

export const createCartItem = async (
req:Request<object,undefined,itemProduct,undefined>,
res:Response)=>{

    // validar inputs 
    const isNotValidItemProduct = utils.isValidItemProduct(req.body) === false;

    if(isNotValidItemProduct){
        console.log("invalid payload -> ",req.body);
        throw new ApiError(400,"datos invalidos, id de producto o cantidad son invalidos");
    }
    const request :itemProduct = req.body;
    console.log("valid payload -> ",request);
    
    let cartId = req.session.cartId;

    //verificar session  cartId

    if (!(utils.isNullOrUndefined(cartId)) && typeof cartId === "number") {
    const cart = await cartService.findById(cartId);
    //verirficar existencia   
    if(utils.isNullOrUndefined(cart)) {
        delete req.session.cartId;
        throw new ApiError(409,"El carrito de la sesión ya no existe")
    }

    cartId = cart.id;
    //añadir al carrito 
    
    }else{
        
    //si no existe 
    const cart = await cartService.create();
    req.session.cartId = cart.id;
    cartId = cart.id;

    }

    const newItemAdd = await cartItemService.createCartItem(cartId,request); 
    res.status(201).json({data:newItemAdd,status:"success"});
} 
