import type { IdentityAddress } from "../../../types.js";

export type AddressErrors = Partial<Record<keyof IdentityAddress, string>>;

export function validateAddress(address: IdentityAddress): AddressErrors {
  const errors: AddressErrors = {};

  if (!address.street.trim()) {
    errors.street = "Street is required.";
  }
  if (!address.city.trim()) {
    errors.city = "City is required.";
  }
  if (!address.state.trim()) {
    errors.state = "State is required.";
  }
  if (!address.country.trim()) {
    errors.country = "Country is required.";
  }
  if (!address.postalCode.trim()) {
    errors.postalCode = "Postal code is required.";
  }

  return errors;
}
