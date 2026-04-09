import { Link } from "react-router-dom";
import { ROUTES } from "../../shared/constants/routes";

export function ResultPage() {
  return (
    <main className="demo-page">
      <section className="demo-card">
        <h1 className="page-title">Verification Result</h1>
        <p className="page-subtitle">
          Placeholder for the upcoming verification summary screen.
        </p>
        <div className="button-row">
          <Link to={ROUTES.verification}>Back to Verification</Link>
          <Link to={ROUTES.checkout}>Go to Checkout Placeholder</Link>
        </div>
      </section>
    </main>
  );
}
