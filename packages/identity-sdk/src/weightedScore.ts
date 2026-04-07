import { IdentityStatus } from "./types";

/**
 * Maps a numeric score to verification status.
 * Threshold: score >= 50 → verified; score < 50 → failed.
 */
export function scoreToStatus(score: number): IdentityStatus {
  return score >= 50 ? "verified" : "failed";
}

/**
 * Produces an integer score in [0, 100] with a weighted distribution:
 * ~30% in [0, 49] and ~70% in [50, 100].
 *
 * Pass `random` for deterministic tests (should return values in [0, 1)).
 */
export function computeWeightedScore(
  random: () => number = Math.random,
): number {
  const branch = random();
  if (branch < 0.3) {
    return Math.floor(random() * 50);
  }
  return Math.floor(random() * 51) + 50;
}
