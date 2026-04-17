import {
  getIdentityData,
  type GetIdentityDataOptions,
  type IdentityData,
  type IdentityInputs,
} from "@identity-verification/sdk";

export function verifyIdentity(
  inputs: IdentityInputs,
  options?: GetIdentityDataOptions,
): IdentityData {
  return getIdentityData(inputs, options);
}
