import { useEffect, useState } from "react";
import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/min";
import {
  formatPhoneNumberAsYouType,
  getCountryDialCode,
  parseAndFormatToE164,
  SUPPORTED_PHONE_COUNTRIES,
} from "./utils/phoneNumberUtils";
import "./PhoneInput.css";

export type PhoneInputProps = {
  defaultCountry?: CountryCode;
  defaultValue?: string;
  value?: string;
  /** Valid E.164 when complete, or `""` when the user clears the field (controlled hosts should reset). */
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
  /** Optional class on the root element for host styling overrides. */
  className?: string;
};

/**
 * Get the country and national number (needed for UI state in components) from a phone number string (E.164 from the host)
 * @param phoneNumber - The phone number to parse.
 * @param fallbackCountry - The fallback country to use if the phone number is not valid.
 * @returns The country and national number.
 */
function getStateFromPhoneNumber(
  phoneNumber: string,
  fallbackCountry: CountryCode,
): { country: CountryCode; nationalNumber: string } {
  const parsed = parsePhoneNumberFromString(phoneNumber);
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

const countryOptions = SUPPORTED_PHONE_COUNTRIES.map((c) => ({
  code: c,
  label: `${c} (${getCountryDialCode(c)})`,
}));

export function PhoneInput({
  defaultCountry = "RS",
  defaultValue,
  value,
  onChange,
  onBlur,
  error: errorMessage,
  showSdkErrors = true,
  validateOnBlur = true,
  className,
}: PhoneInputProps) {
  const initialState = getStateFromPhoneNumber(
    value ?? defaultValue ?? "",
    defaultCountry,
  );
  const [country, setCountry] = useState<CountryCode>(initialState.country);
  const [nationalNumber, setNationalNumber] = useState(
    initialState.nationalNumber,
  );
  const [sdkError, setSdkError] = useState("");

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

    const nextState = getStateFromPhoneNumber(value, defaultCountry);
    setCountry(nextState.country);
    setNationalNumber(nextState.nationalNumber);
    if (showSdkErrors) {
      setSdkError("");
    }
  }, [value, defaultCountry, showSdkErrors]);

  const displayError =
    errorMessage !== undefined ? errorMessage : showSdkErrors ? sdkError : "";

  return (
    <div className={`identity-sdk identity-sdk--phone ${className ?? ""}`}>
      <div className="identity-sdk-field">
        <label className="identity-sdk-label" htmlFor="country-select">
          Country
        </label>
        <select
          className="identity-sdk-select"
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
              if (showSdkErrors) {
                setSdkError("");
              }
              onChange("");
            }
          }}
        >
          {countryOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="identity-sdk-field">
        <label className="identity-sdk-label" htmlFor="national-input">
          Phone number
        </label>
        <input
          className="identity-sdk-input"
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
              onChange("");
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

        {displayError ? (
          <p className="identity-sdk-error" role="alert">
            {displayError}
          </p>
        ) : null}
      </div>
    </div>
  );
}
