<template>
  <main class="demo-page">
    <h1 class="page-title">Verify your identity</h1>
    <p class="page-subtitle">Step {{ step }} of 3: photo, phone number, then address.</p>

    <section class="demo-card">
      <template v-if="step === 1">
        <h2>Photo</h2>
        <p class="muted">Take a clear photo of your face. Continue when it looks good.</p>
        <idsdk-selfie-capture
          :value="draft.selfieUrl"
          @idsdk-change="onSelfieChange"
        />
      </template>

      <template v-if="step === 2">
        <h2>Phone number</h2>
        <p class="muted">Enter a valid number in international format (E.164).</p>
        <idsdk-phone-input
          :value="draft.phone"
          @idsdk-change="onPhoneChange"
        />
      </template>

      <template v-if="step === 3">
        <h2>Address</h2>
        <p class="muted">Fill in every field. We use this to match your rental details.</p>
        <idsdk-address-form
          :value="draft.address"
          @idsdk-change="onAddressChange"
        />
      </template>

      <div class="button-row button-row--spaced">
        <button
          v-if="step > 1"
          type="button"
          @click="goBack"
        >
          Previous
        </button>
        <button
          v-if="step < 3"
          type="button"
          :disabled="!isStepSatisfied(step, draft)"
          @click="goNext"
        >
          Next
        </button>
        <button
          v-else
          type="button"
          :disabled="!isFullDraftReady(draft)"
          @click="runVerification"
        >
          Submit for verification
        </button>
      </div>
    </section>

    <RestartDemoFlow />
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  isValidPhoneE164,
  validateAddress,
  type IdentityAddress,
  type IdentityInputs,
} from "@identity-verification/sdk";
import "../../styles/demo-pages.css";
import RestartDemoFlow from "../../components/RestartDemoFlow.vue";
import { ROUTES } from "../../routing/routes";
import { verifyIdentity } from "../../services/verifyIdentity";
import { setVerificationSnapshot } from "../../state/verification";

const router = useRouter();

const EMPTY_ADDRESS: IdentityAddress = {
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

const draft = reactive<IdentityInputs>({
  selfieUrl: "",
  phone: "",
  address: { ...EMPTY_ADDRESS },
});

const step = ref<1 | 2 | 3>(1);

// idsdk-* elements emit CustomEvent with payload in `detail`.
function getDetail<T>(event: Event): T {
  return (event as CustomEvent<T>).detail;
}

function onSelfieChange(event: Event) {
  draft.selfieUrl = getDetail<string>(event);
}

function onPhoneChange(event: Event) {
  draft.phone = getDetail<string>(event);
}

function onAddressChange(event: Event) {
  draft.address = getDetail<IdentityAddress>(event);
}

function isStepSatisfied(currentStep: 1 | 2 | 3, currentDraft: IdentityInputs): boolean {
  switch (currentStep) {
    case 1:
      return Boolean(currentDraft.selfieUrl.trim());
    case 2:
      return isValidPhoneE164(currentDraft.phone);
    case 3:
      return Object.keys(validateAddress(currentDraft.address)).length === 0;
    default:
      return false;
  }
}

function isFullDraftReady(currentDraft: IdentityInputs): boolean {
  return (
    isStepSatisfied(1, currentDraft) &&
    isStepSatisfied(2, currentDraft) &&
    isStepSatisfied(3, currentDraft)
  );
}

function goNext() {
  if (step.value < 3) {
    step.value = (step.value + 1) as 1 | 2 | 3;
  }
}

function goBack() {
  if (step.value > 1) {
    step.value = (step.value - 1) as 1 | 2 | 3;
  }
}

function runVerification() {
  if (!isFullDraftReady(draft)) {
    return;
  }
  // Preserve existing SDK behavior: verification result is produced by SDK logic.
  const result = verifyIdentity(draft);
  setVerificationSnapshot(result);
  void router.push(ROUTES.result);
}
</script>
