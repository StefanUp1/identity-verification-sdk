import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../routes";
import { useVerification } from "../../state/verification/verification.hooks";

/**
 * Checkout is only reachable after a successful verification so users see outcome on /result first.
 */
export function RequireVerified({ children }: { children: ReactElement }) {
  const { state: verification } = useVerification();
  if (verification?.status !== "verified") {
    return <Navigate to={ROUTES.result} replace />;
  }
  return children;
}
