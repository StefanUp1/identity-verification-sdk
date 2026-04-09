import type { IdentityData } from "@identity-verification/sdk";

/** Persisted verification outcome; aligns with SDK `IdentityData`. */
export type VerificationSnapshot = IdentityData | null;

export const VERIFICATION_ACTIONS = {
  SET: "verification/set",
} as const;

export type VerificationAction = {
  type: typeof VERIFICATION_ACTIONS.SET;
  payload: VerificationSnapshot;
};
