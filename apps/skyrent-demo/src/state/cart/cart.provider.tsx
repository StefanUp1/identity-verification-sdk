import type { PropsWithChildren } from "react";
import { useMemo, useReducer } from "react";
import { CartContext } from "./cart.context";
import { cartReducer, initialCartState } from "./cart.reducer";

export function CartProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
