export type VerificationSnapshot = {
  status: "verified" | "failed";
  score: number;
  phone: string;
  address: string;
  selfieUrl: string;
} | null;

export const VERIFICATION_ACTIONS = {
  SET: "verification/set",
} as const;

export type VerificationAction = {
  type: typeof VERIFICATION_ACTIONS.SET;
  payload: VerificationSnapshot;
};
