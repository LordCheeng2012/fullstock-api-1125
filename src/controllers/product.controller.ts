import * as serviceProduct from "../services/product.services.ts";
import type {Product} from "../repositories/products.repository.ts";
import * as serviceCategory from "../services/category.services.ts";
import type { Category } from "../repositories/category.repository.ts";
import type { Request,Response } from "express";
import { isNullOrUndefined, isValidPrice } from "../utils/utils.ts";
import { ApiError } from "../lib/errors.ts";
import { slugParamSchema } from "../schemas/params.schemas.ts";
import { getProductsQuerySchema } from "../schemas/product.schema.ts";

export interface Filters {
  minPrice?: number;
  maxPrice?: number;
}
export const getProductsByCategorySlug = async (req:Request, res:Response)=>{
  //en ts estos parametros no siempre estaran asi que el ? lo indica

// verificar inputs     
const {slug} = slugParamSchema.parse( req.params);
const {minPrice,maxPrice}  = getProductsQuerySchema.parse(req.query);
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
req:Request,
res:Response)=>{
const {slug} =  slugParamSchema.parse(req.params);    
const productFind : Product | null | undefined = await serviceProduct.getProductBySlug(slug);
if (isNullOrUndefined(productFind)) throw new ApiError(404,"No se encontro el producto por el slug de : " + slug);  
return res.status(200).json({data:productFind,status:"success"});
}