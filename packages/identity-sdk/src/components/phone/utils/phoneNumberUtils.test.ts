import { describe, expect, it } from "vitest";
import {
  formatPhoneNumberAsYouType,
  getCountryDialCode,
  isValidPhoneE164,
  parseAndFormatToE164,
} from "./utils/phoneNumberUtils";

describe("phone number utils", () => {
  it("formats and normalizes a Serbia number to E.164", () => {
    const e164 = parseAndFormatToE164("641234567", "RS");
    expect(e164).toBe("+381641234567");
  });

  it("returns null for invalid numbers", () => {
    expect(parseAndFormatToE164("123", "US")).toBeNull();
  });

  it("returns dial code for selected country", () => {
    expect(getCountryDialCode("RS")).toBe("+381");
  });

  it("formats national input as user types", () => {
    expect(formatPhoneNumberAsYouType("4155552671", "US")).toContain("415");
  });

  it("isValidPhoneE164 accepts E.164 from PhoneInput", () => {
    expect(isValidPhoneE164("+14155552671")).toBe(true);
    expect(isValidPhoneE164("")).toBe(false);
  });
});
