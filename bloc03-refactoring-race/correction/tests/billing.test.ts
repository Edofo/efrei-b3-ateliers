import { beforeEach, describe, expect, it } from "vitest";

import { computeInvoice, computeQuote, resetCounters, type Rental } from "../src/billing.ts";

const rental = (overrides: Partial<Rental> = {}): Rental => ({
  type: "car",
  days: 3,
  km: 100,
  dates: ["2026-09-11", "2026-09-12", "2026-09-13"],
  driverUnder25: false,
  loyalCustomer: false,
  ...overrides,
});

beforeEach(() => {
  resetCounters();
});

describe("computeInvoice - car", () => {
  it("charges the daily rate", () => {
    const invoice = computeInvoice(rental());
    expect(invoice.base).toBe(135);
    expect(invoice.insurance).toBe(36);
    expect(invoice.totalExclVat).toBe(171);
    expect(invoice.totalInclVat).toBe(205.2);
    expect(invoice.deposit).toBe(800);
  });

  it("charges the kilometres above the allowance", () => {
    expect(computeInvoice(rental({ km: 400 })).base).toBe(185);
  });

  it("increases the insurance for a young driver", () => {
    expect(computeInvoice(rental({ driverUnder25: true })).insurance).toBe(60);
  });
});

describe("computeInvoice - van", () => {
  it("charges the rate, the kilometres and the tail lift", () => {
    const invoice = computeInvoice(rental({ type: "van", km: 250, tailLift: true }));
    expect(invoice.base).toBe(290);
    expect(invoice.insurance).toBe(54);
    expect(invoice.deposit).toBe(1500);
  });
});

describe("computeInvoice - motorbike", () => {
  it("charges the rate and the riding gear", () => {
    const invoice = computeInvoice(rental({ type: "motorbike", km: 500, gearIncluded: true }));
    expect(invoice.base).toBe(177);
    expect(invoice.insurance).toBe(45);
    expect(invoice.deposit).toBe(600);
  });
});

describe("computeInvoice - electric bike", () => {
  it("charges the rate and the spare battery", () => {
    const invoice = computeInvoice(rental({ type: "bike", spareBattery: true }));
    expect(invoice.base).toBe(48);
    expect(invoice.insurance).toBe(6);
    expect(invoice.deposit).toBe(150);
  });
});

describe("computeInvoice - cross-cutting rules", () => {
  it("adds a 50% surcharge for a day falling on a public holiday", () => {
    const invoice = computeInvoice(rental({ dates: ["2026-05-01", "2026-05-02", "2026-05-03"] }));
    expect(invoice.holidaySurcharge).toBe(22.5);
  });

  it("applies the loyalty discount", () => {
    const invoice = computeInvoice(rental({ loyalCustomer: true }));
    expect(invoice.discount).toBe(17.1);
    expect(invoice.totalExclVat).toBe(153.9);
  });

  it("numbers invoices in order", () => {
    expect(computeInvoice(rental()).number).toBe(1);
    expect(computeInvoice(rental()).number).toBe(2);
  });

  it("rejects an unknown vehicle type", () => {
    expect(() => computeInvoice(rental({ type: "scooter" }))).toThrow(/Unknown/);
  });
});

describe("computeQuote", () => {
  it("reuses the invoice rates, without surcharge or discount", () => {
    const quote = computeQuote(rental());
    expect(quote.totalExclVat).toBe(171);
    expect(quote.totalInclVat).toBe(205.2);
    expect(quote.deposit).toBe(800);
  });

  it("quotes a van with a tail lift", () => {
    expect(computeQuote(rental({ type: "van", km: 250, tailLift: true })).totalExclVat).toBe(344);
  });
});
