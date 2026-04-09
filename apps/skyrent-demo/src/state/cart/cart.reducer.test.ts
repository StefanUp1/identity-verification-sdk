import { describe, expect, it } from "vitest";
import { INVENTORY } from "../../domain/inventory";
import { cartReducer, initialCartState } from "./cart.reducer";
import { CART_ACTIONS } from "./cart.types";

describe("cartReducer transitions", () => {
  const filmingDrone = INVENTORY[0];

  it("adds item and updates days for duplicate add", () => {
    const stateAfterFirstAdd = cartReducer(initialCartState, {
      type: CART_ACTIONS.ADD,
      payload: { drone: filmingDrone, days: 2 },
    });

    expect(stateAfterFirstAdd).toHaveLength(1);
    expect(stateAfterFirstAdd[0]).toMatchObject({
      droneId: filmingDrone.id,
      days: 2,
    });

    const stateAfterSecondAdd = cartReducer(stateAfterFirstAdd, {
      type: CART_ACTIONS.ADD,
      payload: { drone: filmingDrone, days: 4 },
    });

    expect(stateAfterSecondAdd).toHaveLength(1);
    expect(stateAfterSecondAdd[0]).toMatchObject({ days: 4 });
  });

  it("updates days for an existing item", () => {
    const initial = cartReducer(initialCartState, {
      type: CART_ACTIONS.ADD,
      payload: { drone: filmingDrone, days: 2 },
    });

    const withUpdatedDays = cartReducer(initial, {
      type: CART_ACTIONS.UPDATE_DAYS,
      payload: { droneId: filmingDrone.id, days: 7 },
    });
    expect(withUpdatedDays[0].days).toBe(7);
  });

  it("removes item explicitly", () => {
    const withItem = cartReducer(initialCartState, {
      type: CART_ACTIONS.ADD,
      payload: { drone: filmingDrone, days: 3 },
    });

    const afterRemove = cartReducer(withItem, {
      type: CART_ACTIONS.REMOVE,
      payload: { droneId: filmingDrone.id },
    });

    expect(afterRemove).toEqual([]);
  });

  it("clears all items", () => {
    const withItems = cartReducer(initialCartState, {
      type: CART_ACTIONS.ADD,
      payload: { drone: filmingDrone, days: 1 },
    });
    expect(cartReducer(withItems, { type: CART_ACTIONS.CLEAR })).toEqual([]);
  });
});
