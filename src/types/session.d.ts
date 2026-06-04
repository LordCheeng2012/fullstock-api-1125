import "express-session";
 
declare module "express-session" {
  interface SessionData {
    cartId?: number;
    userId? : number;
    lastOrderId?: number;
  }
}