import { Router } from "express";
import * as categoryControler from "./controllers/category.controler.ts";
import * as productControler from "./controllers/products.controler.ts";
const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Fulltock Api" });
});

router.get("/categories",categoryControler.getCategories);
router.get("/categories/:slug",categoryControler.getCategoryBySlug);
router.get("/categories/:slug/products",productControler.getProductsByCategorySlug);
router.get("/products/:slug",productControler.getProductsBySlug);
export default router;
