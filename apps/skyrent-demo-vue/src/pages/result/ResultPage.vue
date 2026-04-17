<template>
  <main
    v-if="verification"
    class="demo-page"
  >
    <h1 class="page-title">Your verification result</h1>
    <p :class="isVerified ? 'page-subtitle demo-text-success' : 'page-subtitle demo-text-error'">
      Status: <strong>{{ verification.status }}</strong> · Score:
      <strong>{{ verification.score }}</strong>
    </p>

    <section class="demo-card">
      <h2>Summary</h2>
      <div class="result">
        <p>
          <span class="muted">Phone</span>
          <br />
          {{ verification.phone }}
        </p>
        <p>
          <span class="muted">Address</span>
          <br />
          <span class="address-multiline">{{ formatAddressLines(verification.address) }}</span>
        </p>
        <p>
          <span class="muted">Photo</span>
          <br />
          <img
            :src="verification.selfieUrl"
            alt="Photo submitted for verification"
            style="max-width: 100%; max-height: 220px; border-radius: 8px;"
          />
        </p>
      </div>

      <div
        v-if="isVerified"
        class="button-row button-row--spaced"
      >
        <RouterLink
          class="demo-route-link"
          :to="ROUTES.checkout"
        >
          Go to checkout
        </RouterLink>
      </div>
      <div
        v-else
        class="result-fail-actions"
      >
        <p class="demo-banner demo-banner--error result-fail-hint">
          We couldn't verify your identity with these details. Update them and try again.
        </p>
        <div class="button-row">
          <RouterLink
            class="demo-route-link demo-route-link--secondary"
            :to="ROUTES.verification"
          >
            Try again
          </RouterLink>
        </div>
      </div>
    </section>

    <RestartDemoFlow />
  </main>
</template>

<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { RouterLink, useRouter } from "vue-router";
import "../../styles/demo-pages.css";
import RestartDemoFlow from "../../components/RestartDemoFlow.vue";
import { ROUTES } from "../../routing/routes";
import { useVerificationState } from "../../state/verification";
import type { IdentityAddress } from "@identity-verification/sdk";

const router = useRouter();
const verificationState = useVerificationState();
const verification = computed(() => verificationState.snapshot);
const isVerified = computed(() => verification.value?.status === "verified");

watchEffect(() => {
  if (verification.value === null) {
    void router.replace(ROUTES.verification);
  }
});

function formatAddressLines(address: IdentityAddress): string {
  return [
    address.street,
    `${address.city}, ${address.state} ${address.postalCode}`,
    address.country,
  ]
    .filter(Boolean)
    .join("\n");
}
</script>
