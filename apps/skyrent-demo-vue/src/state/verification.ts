import { reactive } from "vue";
import type { IdentityData } from "@identity-verification/sdk";

const verificationState = reactive({
  snapshot: null as IdentityData | null,
});

export function useVerificationState() {
  return verificationState;
}

export function setVerificationSnapshot(snapshot: IdentityData | null) {
  verificationState.snapshot = snapshot;
}
