import { describe, expect, it } from "vitest";
import { getCartTotal, getLineTotal } from "./pricing";
import type { CartItem } from "../state/cart/cart.types";

describe("pricing", () => {
  it("calculates a line total from rate and days", () => {
    const item: CartItem = {
      droneId: "a",
      name: "Cinema Pro X8",
      category: "Filming",
      dailyRate: 220,
      days: 3,
    };

    expect(getLineTotal(item)).toBe(660);
  });

  it("sums multiple line totals for cart total", () => {
    const cart: CartItem[] = [
      {
        droneId: "a",
        name: "Cinema Pro X8",
        category: "Filming",
        dailyRate: 220,
        days: 2,
      },
      {
        droneId: "b",
        name: "CargoLift 20",
        category: "Cargo",
        dailyRate: 260,
        days: 1,
      },
    ];

    expect(getCartTotal(cart)).toBe(700);
  });
});
