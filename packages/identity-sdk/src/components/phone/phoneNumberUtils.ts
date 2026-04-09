import {
  AsYouType,
  type CountryCode,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js/min";

export const SUPPORTED_PHONE_COUNTRIES: CountryCode[] = [
  "US",
  "CA",
  "GB",
  "IE",
  "FR",
  "DE",
  "NL",
  "ES",
  "IT",
  "PT",
  "SE",
  "NO",
  "DK",
  "FI",
  "PL",
  "CZ",
  "RS",
  "AU",
  "NZ",
  "SG",
  "AE",
  "IN",
  "JP",
  "KR",
  "BR",
];

export function formatPhoneNumberAsYouType(
  value: string,
  country: CountryCode,
): string {
  return new AsYouType(country).input(value);
}

export function parseAndFormatToE164(
  value: string,
  country: CountryCode,
): string | null {
  const parsed = parsePhoneNumberFromString(value, country);
  if (!parsed || !parsed.isValid()) {
    return null;
  }
  return parsed.format("E.164");
}

/** True when `phone` is a valid E.164 string (e.g. values emitted by `PhoneInput`). */
export function isValidPhoneE164(phone: string): boolean {
  if (!phone.trim()) {
    return false;
  }
  const parsed = parsePhoneNumberFromString(phone);
  return Boolean(parsed?.isValid());
}

export function getCountryDialCode(country: CountryCode): string {
  return `+${getCountryCallingCode(country)}`;
}
