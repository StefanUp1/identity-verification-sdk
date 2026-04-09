import { Link } from "react-router-dom";
import { ROUTES } from "../../shared/constants/routes";

export function VerificationPage() {
  return (
    <main className="demo-page">
      <section className="demo-card">
        <h1 className="page-title">Identity Verification</h1>
        <p className="page-subtitle">
          Placeholder for the upcoming verification step integration.
        </p>
        <div className="button-row">
          <Link to={ROUTES.browse}>Back to Browse</Link>
          <Link to={ROUTES.result}>Go to Result Placeholder</Link>
        </div>
      </section>
    </main>
  );
}
