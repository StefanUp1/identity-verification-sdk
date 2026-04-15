import { describe, expect, it } from "vitest";
import { validateAddress } from "./validateAddress";

describe("validateAddress", () => {
  it("returns required errors for empty fields", () => {
    const errors = validateAddress({
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    });

    expect(errors).toEqual({
      street: "Street is required.",
      city: "City is required.",
      state: "State is required.",
      country: "Country is required.",
      postalCode: "Postal code is required.",
    });
  });

  it("returns empty errors for a valid address", () => {
    const errors = validateAddress({
      street: "Knez Mihailova 1",
      city: "Belgrade",
      state: "Belgrade",
      country: "Serbia",
      postalCode: "11000",
    });

    expect(errors).toEqual({});
  });

  it("treats non-string core fields as invalid", () => {
    const errors = validateAddress({
      street: 1 as unknown as string,
      city: null as unknown as string,
      state: {} as unknown as string,
      country: [] as unknown as string,
      postalCode: "11000",
    });

    expect(errors).toEqual({
      street: "Street is required.",
      city: "City is required.",
      state: "State is required.",
      country: "Country is required.",
    });
  });
});
