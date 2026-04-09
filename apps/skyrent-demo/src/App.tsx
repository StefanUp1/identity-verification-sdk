import type { ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { BrowsePage } from "./pages/browse/BrowsePage";
import { CheckoutPage } from "./pages/checkout/CheckoutPage";
import { ResultPage } from "./pages/result/ResultPage";
import { VerificationPage } from "./pages/verification/VerificationPage";
import { ROUTES } from "./shared/constants/routes";
import { useCart } from "./state/cart/cart.hooks";
import { AppProviders } from "./state/providers";

function RequireCart({ children }: { children: ReactElement }) {
  const { state: cart } = useCart();
  if (cart.length === 0) {
    return <Navigate to={ROUTES.browse} replace />;
  }
  return children;
}

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
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
                <CheckoutPage />
              </RequireCart>
            }
          />
          <Route path="*" element={<Navigate to={ROUTES.browse} replace />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
