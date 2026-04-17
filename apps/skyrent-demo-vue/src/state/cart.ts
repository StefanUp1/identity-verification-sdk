import { reactive } from "vue";
import type { Drone } from "../domain/inventory";

export type CartItem = {
  droneId: string;
  name: string;
  category: Drone["category"];
  dailyRate: number;
  days: number;
};

const cartState = reactive({
  items: [] as CartItem[],
});

function clampDays(days: number): number {
  if (!Number.isFinite(days)) {
    return 1;
  }
  return Math.max(1, Math.min(30, Math.trunc(days)));
}

export function useCartState() {
  return cartState;
}

export function addToCart(drone: Drone, days: number) {
  const existing = cartState.items.find((item) => item.droneId === drone.id);
  if (existing) {
    existing.days = clampDays(days);
    return;
  }

  cartState.items.push({
    droneId: drone.id,
    name: drone.name,
    category: drone.category,
    dailyRate: drone.dailyRate,
    days: clampDays(days),
  });
}

export function updateCartDays(droneId: string, days: number) {
  const item = cartState.items.find((entry) => entry.droneId === droneId);
  if (!item) {
    return;
  }
  item.days = clampDays(days);
}

export function removeFromCart(droneId: string) {
  const next = cartState.items.filter((item) => item.droneId !== droneId);
  cartState.items.splice(0, cartState.items.length, ...next);
}

export function clearCart() {
  cartState.items.splice(0, cartState.items.length);
}
