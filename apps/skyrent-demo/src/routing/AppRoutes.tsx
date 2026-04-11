import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { BrowsePage } from "../pages/browse/BrowsePage";
import { RequireCart } from "./routeGuards/RequireCart";
import { RequireVerified } from "./routeGuards/RequireVerified";
import { ROUTES } from "./routes";

const VerificationPage = lazy(
  () => import("../pages/verification/VerificationPage"),
);

const ResultPage = lazy(() => import("../pages/result/ResultPage"));

const CheckoutPage = lazy(() => import("../pages/checkout/CheckoutPage"));

function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      Loading…
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path={ROUTES.browse} element={<BrowsePage />} />
        <Route
          path={ROUTES.verification}
          element={
            <RequireCart>
              <VerificationPage />
            </RequireCart>
          }
        />
        <Route
          path={ROUTES.result}
          element={
            <RequireCart>
              <ResultPage />
            </RequireCart>
          }
        />
        <Route
          path={ROUTES.checkout}
          element={
            <RequireCart>
              <RequireVerified>
                <CheckoutPage />
              </RequireVerified>
            </RequireCart>
          }
        />
        <Route path="*" element={<Navigate to={ROUTES.browse} replace />} />
      </Routes>
    </Suspense>
  );
}
