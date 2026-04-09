import type { Drone } from "../../domain/inventory";

export const CART_ACTIONS = {
  ADD: "cart/add",
  UPDATE_DAYS: "cart/updateDays",
  REMOVE: "cart/remove",
  CLEAR: "cart/clear",
} as const;

export type CartItem = {
  droneId: string;
  name: string;
  category: Drone["category"];
  dailyRate: number;
  days: number;
};

export type CartState = CartItem[];

export type CartAction =
  | { type: typeof CART_ACTIONS.ADD; payload: { drone: Drone; days: number } }
  | {
      type: typeof CART_ACTIONS.UPDATE_DAYS;
      payload: { droneId: string; days: number };
    }
  | { type: typeof CART_ACTIONS.REMOVE; payload: { droneId: string } }
  | { type: typeof CART_ACTIONS.CLEAR };
