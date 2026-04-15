export type {
  IdentityAddress,
  IdentityData,
  IdentityInputs,
  IdentityStatus,
} from "./types.js";
export type { GetIdentityDataOptions } from "./logic/getIdentityData.js";
export { getIdentityData } from "./logic/getIdentityData.js";
export { computeWeightedScore, scoreToStatus } from "./logic/weightedScore.js";
export {
  validateAddress,
  type AddressErrors,
} from "./components/address/utils/validateAddress.js";
export {
  AddressForm,
  type AddressFormProps,
} from "./components/address/AddressForm.js";
export {
  PhoneInput,
  type PhoneInputProps,
} from "./components/phone/PhoneInput.js";
export { isValidPhoneE164 } from "./components/phone/utils/phoneNumberUtils.js";
export {
  SelfieCapture,
  type SelfieCaptureProps,
} from "./components/selfie/SelfieCapture.js";
