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
    throw new Error("Your cart is empty. Add a drone before placing an order.");
  }
  await new Promise((resolve) => setTimeout(resolve, 250));

  return {
    orderId: `rent-${Date.now().toString()}-${Math.random().toString()}`,
    confirmedAt: new Date().toISOString(),
  };
}
