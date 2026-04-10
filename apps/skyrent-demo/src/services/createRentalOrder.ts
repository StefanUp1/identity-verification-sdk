import type { IdentityData } from "@identity-verification/sdk";
import type { CartItem } from "../state/cart/cart.types";

export type RentalOrderRequest = {
  cart: CartItem[];
  identity: IdentityData;
};

export type RentalOrderResponse = {
  orderId: string;
  confirmedAt: string;
};

/**
 * Mock checkout API.
 */
export async function createRentalOrder(
  request: RentalOrderRequest,
): Promise<RentalOrderResponse> {
  if (request.cart.length === 0) {
    throw new Error("Cart is empty.");
  }
  await new Promise((resolve) => setTimeout(resolve, 250));
  return {
    orderId: `rent-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    confirmedAt: new Date().toISOString(),
  };
}
