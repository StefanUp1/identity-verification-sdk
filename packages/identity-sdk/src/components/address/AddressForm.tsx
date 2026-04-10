import { useState } from "react";
import type { IdentityAddress } from "../../types.js";
import { validateAddress, type AddressErrors } from "./validateAddress";
import "./AddressForm.css";

export type AddressFormProps = {
  onChange: (address: IdentityAddress) => void;
  defaultValue?: Partial<IdentityAddress>;
  value?: IdentityAddress;
  onBlur?: () => void;
  /**
   * Host-provided messages per field. When a key is present, it wins over SDK blur validation
   * for that field (use `undefined` on a key to omit and fall back to SDK errors).
   */
  errors?: AddressErrors;
  /** When false, the SDK does not track or show its own field errors. Default true. */
  showSdkErrors?: boolean;
  validateOnBlur?: boolean;
  /** Optional class on the root element for host styling overrides. */
  className?: string;
};

const EMPTY_ADDRESS: IdentityAddress = {
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

export function AddressForm({
  onChange,
  defaultValue,
  value,
  onBlur,
  errors: hostErrors,
  showSdkErrors = true,
  validateOnBlur = true,
  className,
}: AddressFormProps) {
  const [internalAddress, setInternalAddress] = useState<IdentityAddress>({
    ...EMPTY_ADDRESS,
    ...defaultValue,
  });
  const [sdkErrors, setSdkErrors] = useState<AddressErrors>({});
  const address = value ?? internalAddress;

  /** Host `errors` entry wins; otherwise SDK blur errors when enabled. */
  const displayErrorForField = (
    key: keyof IdentityAddress,
  ): string | undefined => {
    const host = hostErrors?.[key];
    if (host !== undefined) {
      return host;
    }
    if (!showSdkErrors) {
      return undefined;
    }
    return sdkErrors[key];
  };

  const handleFieldChange = (
    key: keyof IdentityAddress,
    fieldValue: string,
  ) => {
    const nextAddress = { ...address, [key]: fieldValue };
    if (value === undefined) {
      setInternalAddress(nextAddress);
    }
    onChange(nextAddress);

    if (!showSdkErrors) {
      return;
    }
    setSdkErrors((current) => {
      if (!current[key]) {
        return current;
      }
      return { ...current, [key]: undefined };
    });
  };

  const handleFieldBlur = (key: keyof IdentityAddress) => {
    if (validateOnBlur && showSdkErrors) {
      const nextErrors = validateAddress(address);
      setSdkErrors((current) => ({ ...current, [key]: nextErrors[key] }));
    }
    onBlur?.();
  };

  return (
    <div className={`identity-sdk identity-sdk--address ${className ?? ""}`.trim()}>
      <div className="identity-sdk-field">
        <label className="identity-sdk-label" htmlFor="address-street">
          Street
        </label>
      <input
        className="identity-sdk-input"
        id="address-street"
        value={address.street}
        onChange={(event) => handleFieldChange("street", event.target.value)}
        onBlur={() => handleFieldBlur("street")}
      />
      {displayErrorForField("street") ? (
        <p className="identity-sdk-error" role="alert">
          {displayErrorForField("street")}
        </p>
      ) : null}
      </div>

      <div className="identity-sdk-field">
        <label className="identity-sdk-label" htmlFor="address-city">
          City
        </label>
      <input
        className="identity-sdk-input"
        id="address-city"
        value={address.city}
        onChange={(event) => handleFieldChange("city", event.target.value)}
        onBlur={() => handleFieldBlur("city")}
      />
      {displayErrorForField("city") ? (
        <p className="identity-sdk-error" role="alert">
          {displayErrorForField("city")}
        </p>
      ) : null}
      </div>

      <div className="identity-sdk-field">
        <label className="identity-sdk-label" htmlFor="address-state">
          State
        </label>
      <input
        className="identity-sdk-input"
        id="address-state"
        value={address.state}
        onChange={(event) => handleFieldChange("state", event.target.value)}
        onBlur={() => handleFieldBlur("state")}
      />
      {displayErrorForField("state") ? (
        <p className="identity-sdk-error" role="alert">
          {displayErrorForField("state")}
        </p>
      ) : null}
      </div>

      <div className="identity-sdk-field">
        <label className="identity-sdk-label" htmlFor="address-country">
          Country
        </label>
      <input
        className="identity-sdk-input"
        id="address-country"
        value={address.country}
        onChange={(event) => handleFieldChange("country", event.target.value)}
        onBlur={() => handleFieldBlur("country")}
      />
      {displayErrorForField("country") ? (
        <p className="identity-sdk-error" role="alert">
          {displayErrorForField("country")}
        </p>
      ) : null}
      </div>

      <div className="identity-sdk-field">
        <label className="identity-sdk-label" htmlFor="address-postal-code">
          Postal code
        </label>
      <input
        className="identity-sdk-input"
        id="address-postal-code"
        value={address.postalCode}
        onChange={(event) =>
          handleFieldChange("postalCode", event.target.value)
        }
        onBlur={() => handleFieldBlur("postalCode")}
      />
      {displayErrorForField("postalCode") ? (
        <p className="identity-sdk-error" role="alert">
          {displayErrorForField("postalCode")}
        </p>
      ) : null}
      </div>
    </div>
  );
}
