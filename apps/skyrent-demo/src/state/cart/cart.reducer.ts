import { CART_ACTIONS, type CartAction, type CartState } from "./cart.types";

export const initialCartState: CartState = [];

function clampDays(days: number): number {
  return Math.max(1, Math.min(30, days));
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case CART_ACTIONS.ADD: {
      const { drone, days } = action.payload;
      const existing = state.find((item) => item.droneId === drone.id);
      if (existing) {
        return state.map((item) =>
          item.droneId === drone.id
            ? {
                ...item,
                days: clampDays(days),
              }
            : item,
        );
      }

      return [
        ...state,
        {
          droneId: drone.id,
          name: drone.name,
          category: drone.category,
          dailyRate: drone.dailyRate,
          days: clampDays(days),
        },
      ];
    }
    case CART_ACTIONS.UPDATE_DAYS:
      return state.map((item) =>
        item.droneId === action.payload.droneId
          ? { ...item, days: clampDays(action.payload.days) }
          : item,
      );
    case CART_ACTIONS.REMOVE:
      return state.filter((item) => item.droneId !== action.payload.droneId);
    case CART_ACTIONS.CLEAR:
      return [];
    default:
      return state;
  }
}
