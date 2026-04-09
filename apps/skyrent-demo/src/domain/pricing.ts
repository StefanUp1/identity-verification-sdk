import type { CartItem } from "../state/cart/cart.types";

export function getLineTotal(item: CartItem): number {
  return item.dailyRate * item.days;
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + getLineTotal(item), 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
