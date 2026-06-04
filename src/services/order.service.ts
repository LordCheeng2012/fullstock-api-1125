import * as cartService from "./cart.services.ts";
import { ApiError } from "../lib/errors.ts";
import * as db from "../db/index.ts";
import * as orderRepository from "../repositories/order.repository.ts";
import type { Order } from "../repositories/order.repository.ts";
import * as cartRepository from "../repositories/cart.repository.ts";
import type { CreateOrderBody } from "../schemas/body.schemas.ts";
import type { OrderItem } from "../repositories/order.repository.ts";
// Definimos el tipo manualemente por ahora, lo reemplazaremos con Zod más adelante
type CreateOrderBodyDefault = {
  email: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address: string;
  city: string;
  country: string;
  region: string;
  zipCode: string;
  phone: string;
};

export type OrderWithItems = Order & { items: OrderItem[] };

// este type fue remplazado por un objeto generico de zod, ver schemmas.ts
export async function createOrder(
  cartId: number,
  shippingInfo: CreateOrderBody,
  userId? : number
): Promise<Order> {
  
  const cart = await cartService.getHydratedCart(cartId);

  if (cart === null) throw new Error("No se encontró carrito");
  if (cart.items.length === 0) throw new ApiError(400, "El carrito está vacío");

  const order = await db.withTransaction(async (client) => {
    const orderData = { 
      ...shippingInfo,
      userId:userId ?? null,
      total: cart.totalPrice 
    };
    const order = await orderRepository.createOrder(orderData, client);


    const items = cart.items.map((item) => ({
      orderId: order.id,
      productId: item.product.id,
      title: item.product.title,
      price: item.product.price,
      imgSrc: item.product.imgSrc,
      quantity: item.quantity,
    }));

    await orderRepository.createOrderItems(items, client);
    await cartRepository.remove(cartId, client);

    return order;
  });

  return order;
}

export async function getOrderById(id: number): Promise<OrderWithItems | null> {
  const order = await orderRepository.findById(id);
  if (order === null) return null;
 
  const items = await orderRepository.findItemsByOrderId(id);
  return { ...order, items };
}