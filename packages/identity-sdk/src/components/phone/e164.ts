import {
  AsYouType,
  type CountryCode,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js/min";

export const SUPPORTED_COUNTRIES: CountryCode[] = [
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

export function formatNationalInput(value: string, country: CountryCode): string {
  return new AsYouType(country).input(value);
}

export function toE164(value: string, country: CountryCode): string | null {
  const parsed = parsePhoneNumberFromString(value, country);
  if (!parsed || !parsed.isValid()) {
    return null;
  }
  return parsed.format("E.164");
}

export function getDialCode(country: CountryCode): string {
  return `+${getCountryCallingCode(country)}`;
}
