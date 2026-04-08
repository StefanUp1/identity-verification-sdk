import { describe, expect, it } from "vitest";
import { formatNationalInput, getDialCode, toE164 } from "./e164";

describe("phone e164 utils", () => {
  it("formats and normalizes a Serbia number to E.164", () => {
    const e164 = toE164("641234567", "RS");
    expect(e164).toBe("+381641234567");
  });

  it("returns null for invalid numbers", () => {
    expect(toE164("123", "US")).toBeNull();
  });

  it("returns dial code for selected country", () => {
    expect(getDialCode("RS")).toBe("+381");
  });

  it("formats national input as user types", () => {
    expect(formatNationalInput("4155552671", "US")).toContain("415");
  });
});
