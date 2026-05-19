import * as serviceProduct from "../services/product.services.ts";
import type {Product} from "../repositories/products.repository.ts";
import * as serviceCategory from "../services/category.services.ts";
import type { Category } from "../repositories/category.repository.ts";
import type { Request,Response } from "express";
import { isNullOrUndefined, isValidPrice } from "../utils/utils.ts";
import { ApiError } from "../lib/errors.ts";

export interface Filters {
  minPrice?: number;
  maxPrice?: number;
}
export const getProductsByCategorySlug = async (
req:Request<
{slug:Product["slug"]},
unknown,
unknown,
{minPrice?:string,maxPrice?:string}>, //en ts estos parametros no siempre estaran asi que el ? lo indica
res:Response)=>{

// verificar inputs     
const slug = req.params["slug"];
const {minPrice,maxPrice}  = req.query;
const filters:Filters = {};  

if(isValidPrice(Number(minPrice))) filters.minPrice = Number(minPrice);
if(isValidPrice(Number(maxPrice))) filters.maxPrice = Number(maxPrice);
if(isNullOrUndefined(slug)) throw new ApiError(400,"la categoria es invalida");

// verificar categoria 
const existCategory : Category|null = await serviceCategory.getCategoryBySlug(slug);
if(!existCategory) throw new ApiError(400,"No existe categoria");

// realizar consulta al servicio 
const ProductsFind : Product[]|null = await serviceProduct.getProductsByCategorySlug(slug,filters);

if(!ProductsFind) throw new ApiError(404,"No se encontraron productos");

res.status(200).json({data:ProductsFind,status:"success"});
}
export const getProductsBySlug = async (
req:Request<{slug:Product["slug"]}>,
res:Response)=>{
const slug = req.params["slug"];    
const productFind : Product | null | undefined = await serviceProduct.getProductBySlug(slug);
if (isNullOrUndefined(productFind)) throw new ApiError(404,"No se encontro el producto por el slug de : " + slug);  
return res.status(200).json({data:productFind,status:"success"});
}