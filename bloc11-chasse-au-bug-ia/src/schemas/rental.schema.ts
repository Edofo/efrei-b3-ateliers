import type { CreateRentalInput, ReturnRentalInput } from "../types.js";
import { badRequest } from "../utils/http-error.js";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const requirePositiveInteger = (value: unknown, field: string): number => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw badRequest(`Field "${field}" must be a positive integer.`);
  }
  return parsed;
};

const requireIsoDate = (value: unknown, field: string): string => {
  if (typeof value !== "string" || !ISO_DATE.test(value)) {
    throw badRequest(`Field "${field}" must be a date formatted as YYYY-MM-DD.`);
  }
  return value;
};

export const parseCreateRental = (body: Record<string, unknown> = {}): CreateRentalInput => {
  const renterId = requirePositiveInteger(body.renterId, "renterId");
  const itemId = requirePositiveInteger(body.itemId, "itemId");
  const startDate = requireIsoDate(body.startDate, "startDate");
  const expectedReturnDate = requireIsoDate(body.expectedReturnDate, "expectedReturnDate");

  if (expectedReturnDate < startDate) {
    throw badRequest("The expected return date is before the start date.");
  }

  return {
    renterId,
    itemId,
    startDate,
    expectedReturnDate,
    discountPercent: Number(body.discountPercent ?? 0),
  };
};

export const parseReturnRental = (body: Record<string, unknown> = {}): ReturnRentalInput => ({
  returnedAt: requireIsoDate(body.returnedAt, "returnedAt"),
});
