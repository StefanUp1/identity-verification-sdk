import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/demo-pages.css";
import "./BrowsePage.css";
import { INVENTORY, type Drone } from "../../domain/inventory";
import { formatCurrency, getCartTotal } from "../../domain/pricing";
import { CART_ACTIONS } from "../../state/cart/cart.types";
import { useCart } from "../../state/cart/cart.hooks";
import { ROUTES } from "../../routing/routes";

export function BrowsePage() {
  const navigate = useNavigate();
  const { state: cart, dispatch: cartDispatch } = useCart();
  const [daysByDroneId, setDaysByDroneId] = useState<Record<string, number>>(
    {},
  );

  const groupedInventory = useMemo(() => {
    return INVENTORY.reduce<Record<Drone["category"], Drone[]>>(
      (acc, drone) => {
        acc[drone.category].push(drone);
        return acc;
      },
      {
        Filming: [],
        Cargo: [],
      },
    );
  }, []);

  const cartTotal = getCartTotal(cart);

  const getDaysForDrone = (droneId: string): number => {
    return daysByDroneId[droneId] ?? 1;
  };

  const setDaysForDrone = (droneId: string, days: number) => {
    setDaysByDroneId((prev) => ({
      ...prev,
      [droneId]: days,
    }));
  };

  const canContinueToVerification = cart.length > 0;

  return (
    <main className="demo-page browse-page">
      <h1 className="page-title">SkyRent Drone Rentals</h1>
      <p className="page-subtitle">
        Choose a drone, set how many days you need, then add it to your cart.
      </p>
      <div className="browse-layout">
        <div className="browse-layout__inventory">
          <section className="demo-card">
            <h2>Available drones</h2>
            {(Object.keys(groupedInventory) as Array<Drone["category"]>).map(
              (category) => (
                <div key={category} className="category-block">
                  <h3>{category}</h3>
                  <div className="inventory-grid">
                    {groupedInventory[category].map((drone) => {
                      const selectedDays = getDaysForDrone(drone.id);
                      return (
                        <article key={drone.id} className="inventory-item">
                          <h4>{drone.name}</h4>
                          <p className="muted">{drone.description}</p>
                          {drone.category === "Cargo" &&
                          drone.loadCapacityKg !== undefined ? (
                            <p className="muted">
                              Load capacity:{" "}
                              <strong>{drone.loadCapacityKg} kg</strong>
                            </p>
                          ) : null}
                          <div className="price-row">
                            <span>Rate (per day)</span>
                            <strong>{formatCurrency(drone.dailyRate)}</strong>
                          </div>
                          <div className="item-controls">
                            <label htmlFor={`days-${drone.id}`}>
                              Rental days
                            </label>
                            <input
                              id={`days-${drone.id}`}
                              type="number"
                              min={1}
                              max={30}
                              value={selectedDays}
                              onChange={(event) => {
                                const raw = Number(event.target.value);
                                const bounded = Number.isFinite(raw)
                                  ? Math.max(1, Math.min(30, raw))
                                  : 1;
                                setDaysForDrone(drone.id, bounded);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                cartDispatch({
                                  type: CART_ACTIONS.ADD,
                                  payload: { drone, days: selectedDays },
                                });
                                setDaysForDrone(drone.id, 1);
                              }}
                            >
                              Add to cart
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ),
            )}
          </section>
        </div>
        <aside
          className="browse-layout__cart"
          aria-label={`Your cart, ${cart.length} ${cart.length === 1 ? "item" : "items"}`}
        >
          <section className="demo-card cart-panel">
            <h2>
              Your cart <span className="muted">({cart.length})</span>
            </h2>
            {cart.length === 0 ? (
              <p className="muted cart-panel__empty">
                Your cart is empty. Pick a drone from the list to get started.
              </p>
            ) : (
              <div className="cart-panel__scroll">
                <ul className="cart-list">
                  {cart.map((item) => (
                    <li key={item.droneId} className="cart-item">
                      <div>
                        <strong>{item.name}</strong>
                        <p className="muted">
                          {item.days} {item.days === 1 ? "day" : "days"} at{" "}
                          {formatCurrency(item.dailyRate)} / day
                        </p>
                        <p className="muted">
                          Subtotal{" "}
                          <strong>
                            {formatCurrency(item.dailyRate * item.days)}
                          </strong>
                        </p>
                      </div>
                      <div className="cart-actions">
                        <label htmlFor={`cart-days-${item.droneId}`}>
                          Rental days
                        </label>
                        <input
                          id={`cart-days-${item.droneId}`}
                          type="number"
                          min={1}
                          max={30}
                          value={item.days}
                          onChange={(event) => {
                            const raw = Number(event.target.value);
                            const bounded = Number.isFinite(raw)
                              ? Math.max(1, Math.min(30, raw))
                              : 1;
                            cartDispatch({
                              type: CART_ACTIONS.UPDATE_DAYS,
                              payload: { droneId: item.droneId, days: bounded },
                            });
                          }}
                        />
                        <div className="button-row">
                          <button
                            type="button"
                            onClick={() =>
                              cartDispatch({
                                type: CART_ACTIONS.REMOVE,
                                payload: { droneId: item.droneId },
                              })
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="result cart-panel__total">
              <strong>Estimated total:</strong> {formatCurrency(cartTotal)}
            </div>
            <div className="button-row button-row--spaced-sm cart-panel__cta">
              <button
                type="button"
                className="demo-route-link"
                disabled={!canContinueToVerification}
                title={
                  canContinueToVerification
                    ? undefined
                    : "Add at least one drone to your cart to continue."
                }
                onClick={() => navigate(ROUTES.verification)}
              >
                Continue to verification
              </button>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
