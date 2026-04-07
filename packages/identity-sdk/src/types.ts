/**
 * Physical address collected during verification.
 */
export type IdentityAddress = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

/**
 * Raw inputs before scoring (same field shapes as the public result).
 */
export type IdentityInputs = {
  /** Base64-encoded image data URI or raw base64 string from selfie capture */
  selfieUrl: string;
  /** E.164 format, e.g. +14155552671 */
  phone: string;
  address: IdentityAddress;
};

export type IdentityStatus = "verified" | "failed";

/**
 * Public verification result returned by `getIdentityData`.
 *
 * - `selfieUrl` — base64 string
 * - `phone` — E.164 string
 * - `address` — street, city, state, country, postalCode
 * - `score` — integer 0–100
 * - `status` — `verified` if score >= 50, otherwise `failed`
 */
export type IdentityData = {
  selfieUrl: string;
  phone: string;
  address: IdentityAddress;
  score: number;
  status: IdentityStatus;
};
