import { useState } from "react";
import { Navigate } from "react-router-dom";
import "../../styles/demo-pages.css";
import { RestartDemoFlow } from "../../components/RestartDemoFlow";
import { useRestartDemoFlow } from "../../hooks/useRestartDemoFlow";
import {
  formatCurrency,
  getCartTotal,
  getLineTotal,
} from "../../domain/pricing";
import { ROUTES } from "../../routing/routes";
import { createRentalOrder } from "../../services/createRentalOrder";
import { useCart } from "../../state/cart/cart.hooks";
import { useVerification } from "../../state/verification/verification.hooks";

export function CheckoutPage() {
  const { state: cart } = useCart();
  const { state: verification } = useVerification();
  const restartFromHome = useRestartDemoFlow();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

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
      setError(
        e instanceof Error
          ? e.message
          : "We couldn't complete your order. Please try again.",
      );
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
        Review your rental and identity, then place your order.
      </p>

      {orderId ? (
        <section className="demo-card">
          <h2>Rental confirmed</h2>
          <div className="demo-banner demo-banner--success">
            <p>We received your rental request.</p>
            <p>
              Confirmation number: <strong>{orderId}</strong>
            </p>
          </div>
          <div className="button-row button-row--spaced">
            <button type="button" onClick={restartFromHome}>
              Start another rental
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="demo-card">
            <h2>Your rental</h2>
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
              Total due {formatCurrency(getCartTotal(cart))}
            </p>
          </section>

          <section className="demo-card demo-card--stack">
            <h2>Identity on file</h2>
            <p
              className={
                verification.status === "verified"
                  ? "identity-summary demo-text-success"
                  : "identity-summary demo-text-error"
              }
            >
              Verification: {verification.status} · Score:{" "}
              {verification.score}
            </p>
            <p className="identity-phone">{verification.phone}</p>
            <p className="identity-address">
              {verification.address.street}, {verification.address.city},{" "}
              {verification.address.state} {verification.address.postalCode}
            </p>
          </section>

          {error ? (
            <p className="demo-banner demo-banner--error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="button-row button-row--spaced">
            <button
              type="button"
              disabled={submitting || cart.length === 0}
              onClick={completeRental}
            >
              {submitting ? "Placing order…" : "Place rental order"}
            </button>
          </div>
        </>
      )}
      <RestartDemoFlow />
    </main>
  );
}

export default CheckoutPage;
