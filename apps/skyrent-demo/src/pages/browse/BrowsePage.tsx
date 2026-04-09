import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./BrowsePage.css";
import { INVENTORY, type Drone } from "../../domain/inventory";
import { formatCurrency, getCartTotal } from "../../domain/pricing";
import { CART_ACTIONS } from "../../state/cart/cart.types";
import { useCart } from "../../state/cart/cart.hooks";
import { ROUTES } from "../../routing/routes";

export function BrowsePage() {
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

  return (
    <main className="demo-page">
      <h1 className="page-title">SkyRent Drone Rentals</h1>
      <p className="page-subtitle">
        Browse inventory, select rental days, and build your cart.
      </p>
      <section className="demo-card">
        <h2>Drone inventory</h2>
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
                          Load capacity:
                          <strong>{drone.loadCapacityKg} kg</strong>
                        </p>
                      ) : null}
                      <div className="price-row">
                        <span>Daily rate</span>
                        <strong>{formatCurrency(drone.dailyRate)}</strong>
                      </div>
                      <div className="item-controls">
                        <label htmlFor={`days-${drone.id}`}>Days</label>
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
      <section className="demo-card">
        <h2>Cart summary</h2>
        {cart.length === 0 ? (
          <p className="muted">No drones selected yet.</p>
        ) : (
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.droneId} className="cart-item">
                <div>
                  <strong>{item.name}</strong>
                  <p className="muted">
                    {item.days} day(s) @ {formatCurrency(item.dailyRate)}
                  </p>
                  <p className="muted">
                    Line total:{" "}
                    <strong>
                      {formatCurrency(item.dailyRate * item.days)}
                    </strong>
                  </p>
                </div>
                <div className="cart-actions">
                  <label htmlFor={`cart-days-${item.droneId}`}>Days</label>
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
        )}
        <div className="result">
          <strong>Total:</strong> {formatCurrency(cartTotal)}
        </div>
        <div className="button-row" style={{ marginTop: 12 }}>
          {cart.length > 0 && (
            <Link to={ROUTES.verification}>Continue to Verification</Link>
          )}
        </div>
      </section>
    </main>
  );
}
