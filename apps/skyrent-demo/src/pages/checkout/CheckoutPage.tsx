import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../browse/BrowsePage.css";
import {
  formatCurrency,
  getCartTotal,
  getLineTotal,
} from "../../domain/pricing";
import { ROUTES } from "../../routing/routes";
import { createRentalOrder } from "../../services/createRentalOrder";
import { CART_ACTIONS } from "../../state/cart/cart.types";
import { useCart } from "../../state/cart/cart.hooks";
import { VERIFICATION_ACTIONS } from "../../state/verification/verification.types";
import { useVerification } from "../../state/verification/verification.hooks";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { state: cart, dispatch: cartDispatch } = useCart();
  const { state: verification, dispatch: verificationDispatch } =
    useVerification();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const beginNewOrder = () => {
    cartDispatch({ type: CART_ACTIONS.CLEAR });
    verificationDispatch({
      type: VERIFICATION_ACTIONS.SET,
      payload: null,
    });
    navigate(ROUTES.browse, { replace: true });
  };

  const completeRental = async () => {
    if (!verification || cart.length === 0) {
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const { orderId: id } = await createRentalOrder({
        cart,
        identity: verification,
      });
      setOrderId(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not complete order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!verification) {
    return <Navigate to={ROUTES.result} replace />;
  }

  return (
    <main className="demo-page">
      <h1 className="page-title">Checkout</h1>
      <p className="page-subtitle">
        Review your cart and verified identity, then complete the rental.
      </p>

      {orderId ? (
        <section className="demo-card">
          <h2>Rental confirmed</h2>
          <p>Your rental request was submitted successfully.</p>
          <p>
            Order reference: <strong>{orderId}</strong>
          </p>
          <div className="button-row">
            <button type="button" onClick={beginNewOrder}>
              New order
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="demo-card">
            <h2>Cart</h2>
            <ul className="checkout-lines">
              {cart.map((item) => (
                <li key={item.droneId} className="checkout-line">
                  <span>
                    {item.name} × {item.days} days
                  </span>
                  <span>{formatCurrency(getLineTotal(item))}</span>
                </li>
              ))}
            </ul>
            <p className="checkout-total">
              Total {formatCurrency(getCartTotal(cart))}
            </p>
          </section>

          <section className="demo-card demo-card--stack">
            <h2>Verified identity</h2>
            <p className="muted identity-summary">
              Status: {verification.status} — score {verification.score}
            </p>
            <p className="identity-phone">{verification.phone}</p>
            <p className="identity-address">
              {verification.address.street}, {verification.address.city},{" "}
              {verification.address.state} {verification.address.postalCode}
            </p>
          </section>

          {error ? (
            <p className="muted demo-alert" role="alert">
              {error}
            </p>
          ) : null}

          <div className="button-row button-row--spaced">
            <button
              type="button"
              disabled={submitting || cart.length === 0}
              onClick={completeRental}
            >
              {submitting ? "Submitting…" : "Complete rental"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
