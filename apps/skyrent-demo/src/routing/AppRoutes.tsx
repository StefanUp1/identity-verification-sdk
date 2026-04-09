import { Navigate, Route, Routes } from "react-router-dom";
import { BrowsePage } from "../pages/browse/BrowsePage";
import { CheckoutPage } from "../pages/checkout/CheckoutPage";
import { ResultPage } from "../pages/result/ResultPage";
import { VerificationPage } from "../pages/verification/VerificationPage";
import { RequireCart } from "./routeGuards/RequireCart";
import { RequireVerified } from "./routeGuards/RequireVerified";
import { ROUTES } from "./routes";

export function AppRoutes() {
  return (
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
  );
}
