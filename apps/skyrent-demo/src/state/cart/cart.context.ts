import { createContext, type Dispatch } from "react";
import type { CartAction, CartState } from "./cart.types";

export type CartContextValue = {
  state: CartState;
  dispatch: Dispatch<CartAction>;
};

export const CartContext = createContext<CartContextValue | null>(null);
