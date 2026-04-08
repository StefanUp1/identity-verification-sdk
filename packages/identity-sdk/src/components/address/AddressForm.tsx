import { useState } from "react";
import type { IdentityAddress } from "../../types.js";
import { validateAddress, type AddressErrors } from "./validateAddress";

export type AddressFormProps = {
  onChange: (address: IdentityAddress) => void;
  defaultValue?: Partial<IdentityAddress>;
};

const EMPTY_ADDRESS: IdentityAddress = {
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

export function AddressForm({ onChange, defaultValue }: AddressFormProps) {
  const [address, setAddress] = useState<IdentityAddress>({
    ...EMPTY_ADDRESS,
    ...defaultValue,
  });
  const [errors, setErrors] = useState<AddressErrors>({});

  const handleFieldChange = (key: keyof IdentityAddress, value: string) => {
    const nextAddress = { ...address, [key]: value };
    setAddress(nextAddress);

    setErrors((current) => {
      if (!current[key]) {
        return current;
      }
      return { ...current, [key]: undefined };
    });

    const nextErrors = validateAddress(nextAddress);
    if (Object.keys(nextErrors).length === 0) {
      onChange(nextAddress);
    }
  };

  const handleFieldBlur = (key: keyof IdentityAddress) => {
    const nextErrors = validateAddress(address);
    setErrors((current) => ({ ...current, [key]: nextErrors[key] }));
  };

  return (
    <div>
      <label htmlFor="address-street">Street</label>
      <input
        id="address-street"
        value={address.street}
        onChange={(event) => handleFieldChange("street", event.target.value)}
        onBlur={() => handleFieldBlur("street")}
      />
      {errors.street && <p role="alert">{errors.street}</p>}

      <label htmlFor="address-city">City</label>
      <input
        id="address-city"
        value={address.city}
        onChange={(event) => handleFieldChange("city", event.target.value)}
        onBlur={() => handleFieldBlur("city")}
      />
      {errors.city && <p role="alert">{errors.city}</p>}

      <label htmlFor="address-state">State</label>
      <input
        id="address-state"
        value={address.state}
        onChange={(event) => handleFieldChange("state", event.target.value)}
        onBlur={() => handleFieldBlur("state")}
      />
      {errors.state && <p role="alert">{errors.state}</p>}

      <label htmlFor="address-country">Country</label>
      <input
        id="address-country"
        value={address.country}
        onChange={(event) => handleFieldChange("country", event.target.value)}
        onBlur={() => handleFieldBlur("country")}
      />
      {errors.country && <p role="alert">{errors.country}</p>}

      <label htmlFor="address-postal-code">Postal code</label>
      <input
        id="address-postal-code"
        value={address.postalCode}
        onChange={(event) =>
          handleFieldChange("postalCode", event.target.value)
        }
        onBlur={() => handleFieldBlur("postalCode")}
      />
      {errors.postalCode && <p role="alert">{errors.postalCode}</p>}
    </div>
  );
}
