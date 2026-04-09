import { Link, useNavigate } from "react-router-dom";
import "../browse/BrowsePage.css";
import { ROUTES } from "../../routing/routes";
import { CART_ACTIONS } from "../../state/cart/cart.types";
import { useCart } from "../../state/cart/cart.hooks";
import { VERIFICATION_ACTIONS } from "../../state/verification/verification.types";
import { useVerification } from "../../state/verification/verification.hooks";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { dispatch: cartDispatch } = useCart();
  const { dispatch: verificationDispatch } = useVerification();

  const startOver = () => {
    cartDispatch({ type: CART_ACTIONS.CLEAR });
    verificationDispatch({
      type: VERIFICATION_ACTIONS.SET,
      payload: null,
    });
    navigate(ROUTES.browse, { replace: true });
  };

  return (
    <main className="demo-page">
      <section className="demo-card">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">
          Placeholder for the upcoming checkout step (Phase 6).
        </p>
        <div className="button-row">
          <Link to={ROUTES.result}>Back to result</Link>
          <button type="button" onClick={startOver}>
            Start over
          </button>
        </div>
      </section>
    </main>
  );
}
