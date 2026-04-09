import { useContext } from "react";
import {
  VerificationContext,
  type VerificationContextValue,
} from "./verification.context";

export function useVerification(): VerificationContextValue {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error(
      "useVerification must be used inside VerificationProvider.",
    );
  }
  return context;
}
