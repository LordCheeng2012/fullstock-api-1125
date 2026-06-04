import type { itemProduct } from "../controllers/cart-item.controller.ts";

export type Pathparam = string | string[] | undefined;

export function proccessQueryParam(param: Pathparam): string {
  return isNullOrUndefined(param)
    ? ""
    : Array.isArray(param)
      ? isNullOrUndefined(param[0])
        ? ""
        : param.length > 0 && !param
          ? param[0]
          : ""
    : param || "";
}
export function isNullOrUndefined(value: any): value is null | undefined {
  return value === undefined || value === null;
}
export function isValidPrice(value: any): boolean {
  return value || value !== undefined || !isNaN(value);
}
export function isValidItemProduct(item: itemProduct): boolean {
  return (
    !isNullOrUndefined(item.productId) &&
    !isNullOrUndefined(item.quantity) &&
    typeof item.productId === "number" &&
    typeof item.quantity === "number" &&
    item.quantity > 0
  );
}
