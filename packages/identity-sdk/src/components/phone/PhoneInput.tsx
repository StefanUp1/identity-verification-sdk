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
  /**
   * When defined, the host controls the message shown under the field.
   * Use `undefined` to let the SDK show its own copy when `showSdkErrors` is true.
   */
  error?: string;
  /** When false, the SDK does not surface its own validation copy (pair with `error` from the host). Default true. */
  showSdkErrors?: boolean;
  validateOnBlur?: boolean;
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
  error: errorMessage,
  showSdkErrors = true,
  validateOnBlur = true,
}: PhoneInputProps) {
  const initialState = getStateFromE164(
    value ?? defaultValue ?? "",
    defaultCountry,
  );
  const [country, setCountry] = useState<CountryCode>(initialState.country);
  const [nationalNumber, setNationalNumber] = useState(
    initialState.nationalNumber,
  );
  const [sdkError, setSdkError] = useState("");

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
      if (showSdkErrors) {
        setSdkError("Please enter a valid phone number.");
      }
      return;
    }
    if (showSdkErrors) {
      setSdkError("");
    }
    onChange(normalized);
  };

  useEffect(() => {
    if (value === undefined) {
      return;
    }

    const nextState = getStateFromE164(value, defaultCountry);
    setCountry(nextState.country);
    setNationalNumber(nextState.nationalNumber);
    if (showSdkErrors) {
      setSdkError("");
    }
  }, [value, defaultCountry, showSdkErrors]);

  const displayError =
    errorMessage !== undefined ? errorMessage : showSdkErrors ? sdkError : "";

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
          } else if (showSdkErrors) {
            setSdkError("");
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
            if (showSdkErrors) {
              setSdkError("");
            }
            return;
          }
          validateAndEmit(nextNational, country);
        }}
        onBlur={() => {
          if (validateOnBlur && showSdkErrors) {
            if (!nationalNumber) {
              setSdkError("Phone number is required.");
            } else {
              validateAndEmit(nationalNumber, country);
            }
          }
          onBlur?.();
        }}
        placeholder="Enter your number"
      />

      {displayError ? <p role="alert">{displayError}</p> : null}
    </div>
  );
}
