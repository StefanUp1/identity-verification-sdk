import type { PropsWithChildren } from "react";
import { useMemo, useReducer } from "react";
import { VerificationContext } from "./verification.context";
import {
  initialVerificationState,
  verificationReducer,
} from "./verification.reducer";

export function VerificationProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(
    verificationReducer,
    initialVerificationState,
  );
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
}
