import { Link } from "react-router-dom";
import { ROUTES } from "../../shared/constants/routes";

export function CheckoutPage() {
  return (
    <main className="demo-page">
      <section className="demo-card">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">
          Placeholder for the upcoming checkout step.
        </p>
        <div className="button-row">
          <Link to={ROUTES.result}>Back to Result</Link>
          <Link to={ROUTES.browse}>Start Over</Link>
        </div>
      </section>
    </main>
  );
}
