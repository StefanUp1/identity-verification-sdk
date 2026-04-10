import { Link, Navigate } from "react-router-dom";
import "../browse/BrowsePage.css";
import { RestartDemoFlow } from "../../components/RestartDemoFlow";
import { ROUTES } from "../../routing/routes";
import { useVerification } from "../../state/verification/verification.hooks";

function formatAddressLines(address: {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}): string {
  return [
    address.street,
    `${address.city}, ${address.state} ${address.postalCode}`,
    address.country,
  ]
    .filter(Boolean)
    .join("\n");
}

export function ResultPage() {
  const { state: verification } = useVerification();

  if (verification === null) {
    return <Navigate to={ROUTES.verification} replace />;
  }

  const { status, score, phone, address, selfieUrl } = verification;
  const isVerified = status === "verified";

  return (
    <main className="demo-page">
      <h1 className="page-title">Your verification result</h1>
      <p
        className={
          isVerified
            ? "page-subtitle demo-text-success"
            : "page-subtitle demo-text-error"
        }
      >
        Status: <strong>{status}</strong> · Score: <strong>{score}</strong>
      </p>

      <section className="demo-card">
        <h2>Summary</h2>
        <div className="result">
          <p>
            <span className="muted">Phone</span>
            <br />
            {phone}
          </p>
          <p>
            <span className="muted">Address</span>
            <br />
            <span className="address-multiline">
              {formatAddressLines(address)}
            </span>
          </p>
          <p>
            <span className="muted">Photo</span>
            <br />
            <img
              src={selfieUrl}
              alt="Photo submitted for verification"
              style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 8 }}
            />
          </p>
        </div>

        {isVerified ? (
          <div className="button-row button-row--spaced">
            <Link className="demo-route-link" to={ROUTES.checkout}>
              Go to checkout
            </Link>
          </div>
        ) : (
          <div className="result-fail-actions">
            <p className="demo-banner demo-banner--error result-fail-hint">
              We couldn&apos;t verify your identity with these details. Update
              them and try again.
            </p>
            <div className="button-row">
              <Link
                className="demo-route-link demo-route-link--secondary"
                to={ROUTES.verification}
              >
                Try again
              </Link>
            </div>
          </div>
        )}
      </section>
      <RestartDemoFlow />
    </main>
  );
}
