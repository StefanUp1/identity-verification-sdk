<template>
  <main
    v-if="verification"
    class="demo-page"
  >
    <h1 class="page-title">Checkout</h1>
    <p class="page-subtitle">
      Review your rental and identity, then place your order.
    </p>

    <section
      v-if="orderId"
      class="demo-card"
    >
      <h2>Rental confirmed</h2>
      <div class="demo-banner demo-banner--success">
        <p>We received your rental request.</p>
        <p>
          Confirmation number: <strong>{{ orderId }}</strong>
        </p>
      </div>
      <div class="button-row button-row--spaced">
        <button
          type="button"
          @click="restart"
        >
          Start another rental
        </button>
      </div>
    </section>

    <template v-else>
      <section class="demo-card">
        <h2>Your rental</h2>
        <ul class="checkout-lines">
          <li
            v-for="item in cart.items"
            :key="item.droneId"
            class="checkout-line"
          >
            <span>{{ item.name }} × {{ item.days }} days</span>
            <span>{{ formatCurrency(getLineTotal(item)) }}</span>
          </li>
        </ul>
        <p class="checkout-total">Total due {{ formatCurrency(getCartTotal(cart.items)) }}</p>
      </section>

      <section class="demo-card demo-card--stack">
        <h2>Identity on file</h2>
        <p :class="verification.status === 'verified' ? 'identity-summary demo-text-success' : 'identity-summary demo-text-error'">
          Verification: {{ verification.status }} · Score: {{ verification.score }}
        </p>
        <p class="identity-phone">{{ verification.phone }}</p>
        <p class="identity-address">
          {{ verification.address.street }}, {{ verification.address.city }},
          {{ verification.address.state }} {{ verification.address.postalCode }}
        </p>
      </section>

      <p
        v-if="error"
        class="demo-banner demo-banner--error"
        role="alert"
      >
        {{ error }}
      </p>

      <div class="button-row button-row--spaced">
        <button
          type="button"
          :disabled="submitting || cart.items.length === 0"
          @click="completeRental"
        >
          {{ submitting ? "Placing order…" : "Place rental order" }}
        </button>
      </div>
    </template>

    <RestartDemoFlow />
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import "../../styles/demo-pages.css";
import RestartDemoFlow from "../../components/RestartDemoFlow.vue";
import { useRestartDemoFlow } from "../../hooks/useRestartDemoFlow";
import { formatCurrency, getCartTotal, getLineTotal } from "../../domain/pricing";
import { ROUTES } from "../../routing/routes";
import { createRentalOrder } from "../../services/createRentalOrder";
import { useCartState } from "../../state/cart";
import { useVerificationState } from "../../state/verification";

const router = useRouter();
const cart = useCartState();
const verificationState = useVerificationState();
const verification = computed(() => verificationState.snapshot);
const restart = useRestartDemoFlow();

const submitting = ref(false);
const error = ref<string | null>(null);
const orderId = ref<string | null>(null);

watchEffect(() => {
  if (!verification.value) {
    void router.replace(ROUTES.result);
  }
});

async function completeRental() {
  if (!verification.value || cart.items.length === 0) {
    return;
  }

  error.value = null;
  submitting.value = true;
  try {
    const response = await createRentalOrder({
      cart: cart.items,
      identity: verification.value,
    });
    orderId.value = response.orderId;
  } catch (caughtError) {
    error.value =
      caughtError instanceof Error
        ? caughtError.message
        : "We couldn't complete your order. Please try again.";
  } finally {
    submitting.value = false;
  }
}
</script>
