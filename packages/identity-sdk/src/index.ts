export type {
  IdentityAddress,
  IdentityData,
  IdentityInputs,
  IdentityStatus,
} from "./types.js";
export type { GetIdentityDataOptions } from "./getIdentityData.js";
export { getIdentityData } from "./getIdentityData.js";
export { computeWeightedScore, scoreToStatus } from "./weightedScore.js";
export { AddressForm, type AddressFormProps } from "./components/address/AddressForm.js";
export { PhoneInput, type PhoneInputProps } from "./components/phone/PhoneInput.js";
