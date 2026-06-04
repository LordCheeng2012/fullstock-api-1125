import * as cartService from "../services/cart.services.ts";
import * as cartItemService from "../services/cart-item.service.ts";
import type { Request,Response } from "express";
import * as utils from "../utils/utils.ts";
import { ApiError } from "../lib/errors.ts";
import { createCartItemBodySchema,updateCartItemBodySchema } from "../schemas/cart-item.schema.ts";
import { idParamSchema } from "../schemas/id-params.schema.ts";
import { getValidateCart } from "../guards/guards.ts";

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

    //verificar session  cartId
    if (utils.isNullOrUndefined(req.session.cartId) ) {
        
        //si cartId de la session  no existe 
        const cart = await cartService.create(req.session.userId);
        //asignamos el nuevo cartID generado a la session
        req.session.cartId = cart.id;
    }else{
        /*
            si exsiste una session.
            - verificar si existe el carrito de la session del usuario
        */
        const cart = await getValidateCart(req);
        // reforzamos referencia al carrito actual
        req.session.cartId = cart.id;
    }

    //añadir al carrito 
    const newItemAdd = await cartItemService.createCartItem(req.session.cartId,request); 
    res.status(201).json({data:newItemAdd,status:"success"});
} 
export const updateCartItem = async (
        req:Request, //eliminamos tipos ,ya que no es nesesario por los schemnas
        res:Response)=>{

        // capturamos parametros de solicitud 
        const {id} = idParamSchema.parse(req.params);
        const {quantity} = updateCartItemBodySchema.parse(req.body);

        // validamos existencia de carrito  
        const cartID = (await getValidateCart(req)).id;     

        // si no hay excepciones entonces ... existe 
        // validamos inputs parametros de ruta 

        if( isNaN(id) || !Number.isInteger(id) || id < 1 || utils.isNullOrUndefined(id)){
            throw new ApiError(400,"EL id debe ser un numero positivo valido ");
        }

        // validamos iputs query params 
        if(isNaN(quantity) || utils.isNullOrUndefined(quantity) || !Number.isInteger(quantity) ){
           throw new  ApiError(400, "quantity es requerido y debe ser un número positivo");
        }
            
        const Updateitem = await cartItemService.updateCartItemQuantity(cartID,id,quantity);

         res.status(200).json({status:"success",data:Updateitem}) 


}
export const deleteCartItem = async (
    req:Request,
    res:Response
    ) =>{

        // capturamos parametros de solicitud 
        const {id} = idParamSchema.parse(req.params);

        // validamos el cart ID de la session 
        const cartID = (await getValidateCart(req)).id;     
         // validamos inputs parametros de ruta 

        if( isNaN(id) || !Number.isInteger(id) || id < 1 || utils.isNullOrUndefined(id)){
            throw new ApiError(400,"EL id debe ser un numero positivo valido ");
        }

        // ejecutamos servicio 

        await cartItemService.deleteItem(cartID,id);
        res.status(204).send();
}