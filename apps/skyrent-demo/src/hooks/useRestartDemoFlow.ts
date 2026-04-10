import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routing/routes";
import { CART_ACTIONS } from "../state/cart/cart.types";
import { useCart } from "../state/cart/cart.hooks";
import { VERIFICATION_ACTIONS } from "../state/verification/verification.types";
import { useVerification } from "../state/verification/verification.hooks";

/** Clears cart and verification, then navigates to browse (same as a fresh demo run). */
export function useRestartDemoFlow() {
  const navigate = useNavigate();
  const { dispatch: cartDispatch } = useCart();
  const { dispatch: verificationDispatch } = useVerification();

  return useCallback(() => {
    cartDispatch({ type: CART_ACTIONS.CLEAR });
    verificationDispatch({
      type: VERIFICATION_ACTIONS.SET,
      payload: null,
    });
    navigate(ROUTES.browse, { replace: true });
  }, [cartDispatch, navigate, verificationDispatch]);
}
