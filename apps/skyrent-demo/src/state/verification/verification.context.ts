import { createContext, type Dispatch } from "react";
import type {
  VerificationAction,
  VerificationSnapshot,
} from "./verification.types";

export type VerificationContextValue = {
  state: VerificationSnapshot;
  dispatch: Dispatch<VerificationAction>;
};

export const VerificationContext = createContext<VerificationContextValue | null>(
  null,
);
