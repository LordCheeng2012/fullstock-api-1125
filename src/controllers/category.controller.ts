import type {Request,Response } from "express";
import * as categoryService from "../services/category.services.ts";

import type { Category } from "../repositories/category.repository.ts";
import { ApiError } from "../lib/errors.ts";
import { slugParamSchema } from "../schemas/params.schemas.ts";

interface queryParams {
    slug :Category["slug"]
}

export async function getCategories(_req : Request,res:Response) {
const categories = await categoryService.getAll();
res.status(200).json({data:categories,status:"success"});
}

export async function getCategoryBySlug(req:Request,res:Response) {
const {slug} = slugParamSchema.parse(req.params);
const category = await categoryService.getCategoryBySlug(slug);
if(!category) throw new ApiError(404,"No se encontro categoria");
 res.status(200).json({data:category,status:"success"});
}

export async function getCategoryById(req:Request,res:Response) {
const {slug} =  slugParamSchema.parse(req.params);
const category = await categoryService.getCategoryBySlug(slug);
if(!category) throw new ApiError(404,"No se encontro categoria");
 res.status(200).json({data:category,status:"success"});
}