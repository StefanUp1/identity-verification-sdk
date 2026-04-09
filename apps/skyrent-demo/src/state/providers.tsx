import type { PropsWithChildren } from "react";
import { AppProvider } from "./root/AppProvider";

export function AppProviders({ children }: PropsWithChildren) {
  return <AppProvider>{children}</AppProvider>;
}
