import { describe, expect, it } from "vitest";

import { applyDiscount, billedDays, computeRentalTotal } from "../src/services/pricing.js";

describe("billedDays", () => {
  it("charges one day per rental day", () => {
    expect(billedDays(new Date(2026, 8, 11), new Date(2026, 8, 14))).toBe(3);
  });

  it("always charges at least one day", () => {
    const sameDay = new Date(2026, 8, 11);
    expect(billedDays(sameDay, sameDay)).toBe(1);
  });
});

describe("applyDiscount", () => {
  it("applies the discount and rounds to the cent", () => {
    expect(applyDiscount(10_000, 10)).toBe(9000);
    expect(applyDiscount(3333, 15)).toBe(2833);
  });

  it("leaves the amount untouched without a discount", () => {
    expect(applyDiscount(2700, 0)).toBe(2700);
  });
});

describe("computeRentalTotal", () => {
  it("multiplies the daily rate by the number of days", () => {
    expect(
      computeRentalTotal({
        startDate: new Date(2026, 7, 3),
        endDate: new Date(2026, 7, 6),
        dailyRateCents: 900,
        discountPercent: 0,
      }),
    ).toEqual({ days: 3, totalCents: 2700 });
  });

  it("takes the commercial discount into account", () => {
    expect(
      computeRentalTotal({
        startDate: new Date(2026, 8, 11),
        endDate: new Date(2026, 8, 14),
        dailyRateCents: 4500,
        discountPercent: 10,
      }),
    ).toEqual({ days: 3, totalCents: 12_150 });
  });
});
