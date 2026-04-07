import { describe, expect, it, vi } from "vitest";
import {
  computeWeightedScore,
  getIdentityData,
  scoreToStatus,
} from "./index.js";

const sampleInputs = {
  selfieUrl: "data:image/jpeg;base64,abc",
  phone: "+14155552671",
  address: {
    street: "1 Market St",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postalCode: "94105",
  },
} as const;

describe("scoreToStatus", () => {
  it("maps score < 50 to failed", () => {
    expect(scoreToStatus(0)).toBe("failed");
    expect(scoreToStatus(49)).toBe("failed");
  });

  it("maps score >= 50 to verified", () => {
    expect(scoreToStatus(50)).toBe("verified");
    expect(scoreToStatus(100)).toBe("verified");
  });
});

describe("computeWeightedScore", () => {
  it("returns integers in [0, 100]", () => {
    for (let i = 0; i < 500; i++) {
      const s = computeWeightedScore();
      expect(Number.isInteger(s)).toBe(true);
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(100);
    }
  });

  it("respects ~30% below 50 and ~70% at or above 50 (sample tolerance)", () => {
    const n = 20_000;
    let low = 0;
    for (let i = 0; i < n; i++) {
      const s = computeWeightedScore();
      if (s < 50) low++;
    }
    const p = low / n;
    expect(p).toBeGreaterThan(0.25);
    expect(p).toBeLessThan(0.35);
  });
});

describe("getIdentityData", () => {
  it("returns inputs plus score and status; copies address to a new object", () => {
    const address = { ...sampleInputs.address };
    // first call returns 0.3, second call returns 0. Needed since computeWeightedScore, random() is invoked twice inside getIdentityData
    const random = vi.fn().mockReturnValueOnce(0.35).mockReturnValueOnce(0);

    const out = getIdentityData({ ...sampleInputs, address }, { random });

    expect(out.selfieUrl).toBe(sampleInputs.selfieUrl);
    expect(out.phone).toBe(sampleInputs.phone);
    expect(out.address).toEqual(address);
    expect(out.address).not.toBe(address);
    expect(out.score).toBe(50);
    expect(out.status).toBe("verified");
  });

  it("uses failed when random lands in the low score bucket", () => {
    const random = vi
      .fn()
      .mockReturnValueOnce(0.2) // first call return 0.2
      .mockReturnValueOnce(0); // second call returns 0

    const out = getIdentityData({ ...sampleInputs }, { random });

    expect(out.score).toBe(0);
    expect(out.status).toBe("failed");
  });
});
