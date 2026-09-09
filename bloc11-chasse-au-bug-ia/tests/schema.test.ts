import { describe, expect, it } from "vitest";

import { parseCreateRental, parseReturnRental } from "../src/schemas/rental.schema.js";

describe("parseCreateRental", () => {
  it("normalises a valid request", () => {
    expect(
      parseCreateRental({
        renterId: "2",
        itemId: 1,
        startDate: "2026-09-11",
        expectedReturnDate: "2026-09-14",
        discountPercent: 10,
      }),
    ).toEqual({
      renterId: 2,
      itemId: 1,
      startDate: "2026-09-11",
      expectedReturnDate: "2026-09-14",
      discountPercent: 10,
    });
  });

  it("rejects an id that is not a positive integer", () => {
    expect(() => parseCreateRental({ renterId: 0, itemId: 1 })).toThrow(/renterId/);
  });

  it("rejects a malformed date", () => {
    expect(() => parseCreateRental({ renterId: 1, itemId: 1, startDate: "11/09/2026" })).toThrow(
      /startDate/,
    );
  });

  it("rejects a return date before the start date", () => {
    expect(() =>
      parseCreateRental({
        renterId: 1,
        itemId: 1,
        startDate: "2026-09-14",
        expectedReturnDate: "2026-09-11",
      }),
    ).toThrow(/before the start date/);
  });
});

describe("parseReturnRental", () => {
  it("requires a return date", () => {
    expect(() => parseReturnRental({})).toThrow(/returnedAt/);
    expect(parseReturnRental({ returnedAt: "2026-09-14" })).toEqual({
      returnedAt: "2026-09-14",
    });
  });
});
