import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../routes";
import { useCart } from "../../state/cart/cart.hooks";

export function RequireCart({ children }: { children: ReactElement }) {
  const { state: cart } = useCart();
  if (cart.length === 0) {
    return <Navigate to={ROUTES.browse} replace />;
  }
  return children;
}
