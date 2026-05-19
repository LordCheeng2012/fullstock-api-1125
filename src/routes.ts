import { Router } from "express";
import * as categoryControler from "./controllers/category.controler.ts";
import * as productControler from "./controllers/product.controler.ts";
import * as cartControler from "./controllers/cart-item.controler.ts";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Fulltock Api" });
});

router.get("/categories", categoryControler.getCategories);
router.get("/categories/:slug", categoryControler.getCategoryBySlug);
router.get("/categories/:slug/products",productControler.getProductsByCategorySlug,);
router.get("/products/:slug", productControler.getProductsBySlug);
router.post("/cart/items", cartControler.createCartItem);
router.patch("/cart/items/:id",cartControler.updateCartItem);
router.delete("/cart/items/:id",cartControler.deleteCartItem);
export default router;
