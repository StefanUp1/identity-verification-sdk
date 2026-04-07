import type { IdentityData, IdentityInputs } from "./types";
import { computeWeightedScore, scoreToStatus } from "./weightedScore";

export type GetIdentityDataOptions = {
  /** Defaults to `Math.random`. Pass a mocked function for deterministic tests. */
  random?: () => number;
};

/**
 * Composes collected identity inputs with a weighted score and derived status.
 */
export function getIdentityData(
  inputs: IdentityInputs,
  options?: GetIdentityDataOptions,
): IdentityData {
  const score = computeWeightedScore(options?.random ?? Math.random);
  return {
    selfieUrl: inputs.selfieUrl,
    phone: inputs.phone,
    address: { ...inputs.address },
    score,
    status: scoreToStatus(score),
  };
}
