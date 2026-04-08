import { useMemo, useState } from "react";
import type { CountryCode } from "libphonenumber-js/min";
import {
  formatNationalInput,
  getDialCode,
  SUPPORTED_COUNTRIES,
  toE164,
} from "./e164";

export type PhoneInputProps = {
  defaultCountry?: CountryCode;
  onChange: (phoneE164: string) => void;
};

export function PhoneInput({
  defaultCountry = "RS",
  onChange,
}: PhoneInputProps) {
  const [country, setCountry] = useState<CountryCode>(defaultCountry);
  const [national, setNational] = useState("");
  const [error, setError] = useState("");

  const countryOptions = useMemo(
    () =>
      SUPPORTED_COUNTRIES.map((c) => ({
        code: c,
        label: `${c} (${getDialCode(c)})`,
      })),
    [],
  );

  const validateAndEmit = (value: string, selectedCountry: CountryCode) => {
    const normalized = toE164(value, selectedCountry);
    if (!normalized) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError("");
    onChange(normalized);
  };

  return (
    <div>
      <label htmlFor="country-select">Country</label>
      <select
        id="country-select"
        value={country}
        onChange={(event) => {
          const nextCountry = event.target.value as CountryCode;
          setCountry(nextCountry);
          if (national) {
            validateAndEmit(national, nextCountry);
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
        value={national}
        onChange={(event) => {
          const nextNational = formatNationalInput(event.target.value, country);
          setNational(nextNational);
          if (!nextNational) {
            setError("");
            return;
          }
          validateAndEmit(nextNational, country);
        }}
        onBlur={() => {
          if (!national) {
            setError("");
            return;
          }
          validateAndEmit(national, country);
        }}
        placeholder="Enter your number"
      />

      {error && <p role="alert">{error}</p>}
    </div>
  );
}
