import { createRouter, createWebHistory } from "vue-router";
import { ROUTES } from "./routes";
import { useCartState } from "../state/cart";
import { useVerificationState } from "../state/verification";

const BrowsePage = () => import("../pages/browse/BrowsePage.vue");
const VerificationPage = () => import("../pages/verification/VerificationPage.vue");
const ResultPage = () => import("../pages/result/ResultPage.vue");
const CheckoutPage = () => import("../pages/checkout/CheckoutPage.vue");

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: ROUTES.browse, component: BrowsePage },
    {
      path: ROUTES.verification,
      component: VerificationPage,
      beforeEnter: () => {
        if (useCartState().items.length === 0) {
          return ROUTES.browse;
        }
        return true;
      },
    },
    {
      path: ROUTES.result,
      component: ResultPage,
      beforeEnter: () => {
        if (useCartState().items.length === 0) {
          return ROUTES.browse;
        }
        return true;
      },
    },
    {
      path: ROUTES.checkout,
      component: CheckoutPage,
      beforeEnter: () => {
        if (useCartState().items.length === 0) {
          return ROUTES.browse;
        }
        if (useVerificationState().snapshot?.status !== "verified") {
          return ROUTES.result;
        }
        return true;
      },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: ROUTES.browse,
    },
  ],
});

export { router };
