import { useEffect, useMemo, useState } from "react";
import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/min";
import {
  formatPhoneNumberAsYouType,
  getCountryDialCode,
  parseAndFormatToE164,
  SUPPORTED_PHONE_COUNTRIES,
} from "./phoneNumberUtils";

export type PhoneInputProps = {
  defaultCountry?: CountryCode;
  defaultValue?: string;
  value?: string;
  onChange: (phoneE164: string) => void;
  onBlur?: () => void;
};

function getStateFromE164(
  phoneE164: string,
  fallbackCountry: CountryCode,
): { country: CountryCode; nationalNumber: string } {
  const parsed = parsePhoneNumberFromString(phoneE164);
  const parsedCountry = parsed?.country;

  if (parsedCountry && SUPPORTED_PHONE_COUNTRIES.includes(parsedCountry)) {
    return {
      country: parsedCountry,
      nationalNumber: parsed.nationalNumber,
    };
  }

  return {
    country: fallbackCountry,
    nationalNumber: "",
  };
}

export function PhoneInput({
  defaultCountry = "RS",
  defaultValue,
  value,
  onChange,
  onBlur,
}: PhoneInputProps) {
  const initialState = getStateFromE164(
    value ?? defaultValue ?? "",
    defaultCountry,
  );
  const [country, setCountry] = useState<CountryCode>(initialState.country);
  const [nationalNumber, setNationalNumber] = useState(
    initialState.nationalNumber,
  );
  const [error, setError] = useState("");

  const countryOptions = useMemo(
    () =>
      SUPPORTED_PHONE_COUNTRIES.map((c) => ({
        code: c,
        label: `${c} (${getCountryDialCode(c)})`,
      })),
    [],
  );

  const validateAndEmit = (value: string, selectedCountry: CountryCode) => {
    const normalized = parseAndFormatToE164(value, selectedCountry);
    if (!normalized) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError("");
    onChange(normalized);
  };

  useEffect(() => {
    if (value === undefined) {
      return;
    }

    const nextState = getStateFromE164(value, defaultCountry);
    setCountry(nextState.country);
    setNationalNumber(nextState.nationalNumber);
    setError("");
  }, [value, defaultCountry]);

  return (
    <div>
      <label htmlFor="country-select">Country</label>
      <select
        id="country-select"
        value={country}
        onChange={(event) => {
          const nextCountry = event.target.value as CountryCode;
          setCountry(nextCountry);
          const nextNational = formatPhoneNumberAsYouType(
            nationalNumber,
            nextCountry,
          );
          setNationalNumber(nextNational);

          if (nextNational) {
            validateAndEmit(nextNational, nextCountry);
          } else {
            setError("");
          }
        }}
      >
        {countryOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>

      <label htmlFor="national-input">Phone number</label>
      <input
        id="national-input"
        type="tel"
        value={nationalNumber}
        onChange={(event) => {
          const nextNational = formatPhoneNumberAsYouType(
            event.target.value,
            country,
          );
          setNationalNumber(nextNational);
          if (!nextNational) {
            setError("");
            return;
          }
          validateAndEmit(nextNational, country);
        }}
        onBlur={() => {
          if (!nationalNumber) {
            setError("Phone number is required.");
            onBlur?.();
            return;
          }
          validateAndEmit(nationalNumber, country);
          onBlur?.();
        }}
        placeholder="Enter your number"
      />

      {error && <p role="alert">{error}</p>}
    </div>
  );
}
