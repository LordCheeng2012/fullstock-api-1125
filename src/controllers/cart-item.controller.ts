import * as cartService from "../services/cart.services.ts";
import * as cartItemService from "../services/cart-item.service.ts";
import type { Request,Response } from "express";
import * as utils from "../utils/utils.ts";
import { ApiError } from "../lib/errors.ts";
import { createCartItemBodySchema,updateCartItemBodySchema } from "../schemas/cart-item.schema.ts";
import { idParamSchema } from "../schemas/id-params.schema.ts";

export interface itemProduct {
    productId:number,
    quantity:number
}

export const createCartItem = async (req:Request,res:Response)=>{

    // validar inputs 
    const isNotValidItemProduct = utils.isValidItemProduct(req.body) === false;

    if(isNotValidItemProduct){
        console.log("invalid payload -> ",req.body);
        throw new ApiError(400,"datos invalidos, id de producto o cantidad son invalidos");
    }

    const request :itemProduct = createCartItemBodySchema.parse(req.body);

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
export const updateCartItem = async (
        req:Request<{id:number},unknown,{quantity?:unknown}>,
        res:Response)=>{

            // capturamos parametros de solicitud 
        const {id} = idParamSchema.parse(req.params);
        const {quantity} = updateCartItemBodySchema.parse(req.body);
            
            // validamos el cart ID de la session 
        if(utils.isNullOrUndefined(req.session.cartId)){
            // no existe session 
        throw new ApiError(404,"No existe el item en el carrito o el carrito no existe");

        } 
            // existe session
        const cartId = req.session.cartId;
                //validamos existencia de carrito 
        const existCart = await cartService.findById(cartId) !== null;

        if(!existCart){
            // no existe 
            delete req.session.cartId;
            throw new ApiError(409,"El carrito de la session ya no existe");
        }
            // existe 
        // validamos inputs parametros de ruta 

        if( isNaN(id) || !Number.isInteger(id) || id < 1 || utils.isNullOrUndefined(id)){
            throw new ApiError(400,"EL id debe ser un numero positivo valido ");
        }

        // validamos  iputs query params 
        if(isNaN(quantity) || utils.isNullOrUndefined(quantity) || !Number.isInteger(quantity) ){
           throw new  ApiError(400, "quantity es requerido y debe ser un número positivo");
        }
            
        const Updateitem = await cartItemService.updateCartItemQuantity(cartId,id,quantity);

         res.status(200).json({status:"success",data:Updateitem}) 


}
export const deleteCartItem = async (
    req:Request,
    res:Response
    ) =>{

        // capturamos parametros de solicitud 
        const {id} = idParamSchema.parse(req.params);

        // validamos el cart ID de la session 
        if(utils.isNullOrUndefined(req.session.cartId)){
            
        // no existe session 
        throw new ApiError(404,"No existe el Ítem en el carrito ");
        } 

        // existe session
        const cartId = req.session.cartId;

        //validamos existencia de carrito 
        const existCart = await cartService.findById(cartId) !== null;

        if(!existCart){
            // no existe 
            delete req.session.cartId;
            throw new ApiError(409,"El carrito de la session ya no existe");
        }

         // validamos inputs parametros de ruta 

        if( isNaN(id) || !Number.isInteger(id) || id < 1 || utils.isNullOrUndefined(id)){
            throw new ApiError(400,"EL id debe ser un numero positivo valido ");
        }

        // ejecutamos servicio 

        await cartItemService.deleteItem(cartId,id);
        res.status(204).send();
}