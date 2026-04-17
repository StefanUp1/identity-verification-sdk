import { useRouter } from "vue-router";
import { ROUTES } from "../routing/routes";
import { clearCart } from "../state/cart";
import { setVerificationSnapshot } from "../state/verification";

export function useRestartDemoFlow() {
  const router = useRouter();

  return () => {
    clearCart();
    setVerificationSnapshot(null);
    void router.replace(ROUTES.browse);
  };
}
