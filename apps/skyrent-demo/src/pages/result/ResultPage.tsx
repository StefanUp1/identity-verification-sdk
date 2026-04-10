import { Link, Navigate } from "react-router-dom";
import "../browse/BrowsePage.css";
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
      <h1 className="page-title">Verification result</h1>
      <p className="page-subtitle">
        Status: <strong>{status}</strong> — score: <strong>{score}</strong>
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
            <span className="muted">Selfie</span>
            <br />
            <img
              src={selfieUrl}
              alt="Verification capture"
              style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 8 }}
            />
          </p>
        </div>

        {isVerified ? (
          <div className="button-row button-row--spaced">
            <Link to={ROUTES.checkout}>Continue to checkout</Link>
          </div>
        ) : (
          <div className="button-row button-row--spaced button-row--center">
            <p className="muted result-fail-hint">
              Verification did not pass. Adjust your details and try again.
            </p>
            <Link to={ROUTES.verification}>Run again</Link>
          </div>
        )}
      </section>
    </main>
  );
}
