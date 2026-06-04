import type { Request, Response } from "express";
import { getValidateCart } from "../guards/guards.ts"; 
export async function getCart(req: Request, res: Response) {
  const getCartSession = await  getValidateCart(req,true);
  res.json({ data: getCartSession,status:"success" });
}