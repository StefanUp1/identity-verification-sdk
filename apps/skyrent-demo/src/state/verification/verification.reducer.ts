import type {
  VerificationAction,
  VerificationSnapshot,
} from "./verification.types";

export const initialVerificationState: VerificationSnapshot = null;

export function verificationReducer(
  _state: VerificationSnapshot,
  action: VerificationAction,
): VerificationSnapshot {
  return action.payload;
}
