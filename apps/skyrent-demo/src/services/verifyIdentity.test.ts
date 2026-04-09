import { describe, expect, it, vi } from "vitest";
import { verifyIdentity } from "./verifyIdentity";

describe("verifyIdentity", () => {
  it("returns a verified result with deterministic scoring (happy path)", () => {
    const random = vi
      .fn()
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0);
    const result = verifyIdentity(
      {
        selfieUrl: "data:image/jpeg;base64,abc",
        phone: "+14155552671",
        address: {
          street: "1 Market St",
          city: "San Francisco",
          state: "CA",
          country: "US",
          postalCode: "94105",
        },
      },
      { random },
    );
    expect(result.status).toBe("verified");
    expect(result.score).toBeGreaterThanOrEqual(50);
    expect(result.phone).toBe("+14155552671");
  });
});
