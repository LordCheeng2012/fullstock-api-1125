import { Router } from "express";
import * as categoryControler from "./controllers/category.controller.ts";
import * as productControler from "./controllers/product.controller.ts";
import * as cartItemControler from "./controllers/cart-item.controller.ts";
import * as cartControler from "./controllers/cart-controller.ts";
import * as orderController from "./controllers/order.controller.ts";
import * as userController from "./controllers/user.controller.ts"
import * as sessionController from "./controllers/session.controller.ts";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Fulltock Api" });
});

//categories
router.get("/categories", categoryControler.getCategories);
router.get("/categories/:slug", categoryControler.getCategoryBySlug);
router.get( "/categories/:slug/products",productControler.getProductsByCategorySlug);

//productos
router.get("/products/:slug", productControler.getProductsBySlug);


//carts
router.post("/cart/items", cartItemControler.createCartItem);
router.patch("/cart/items/:id", cartItemControler.updateCartItem);
router.delete("/cart/items/:id", cartItemControler.deleteCartItem);
router.get("/cart", cartControler.getCart);


// Órdenes
router.post("/orders", orderController.createOrder);
router.get("/orders/:id", orderController.getOrder);


//usuarios 
router.post("/users",userController.createUser);


// Sesiones
router.post("/sessions", sessionController.createSession);
router.delete("/sessions", sessionController.deleteSession);
router.get("/users/me", userController.getCurrentUser);



export default router;