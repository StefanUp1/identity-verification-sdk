import type { PropsWithChildren } from "react";
import { CartProvider } from "./cart/cart.provider";
import { VerificationProvider } from "./verification/verification.provider";

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <CartProvider>
      <VerificationProvider>{children}</VerificationProvider>
    </CartProvider>
  );
}
