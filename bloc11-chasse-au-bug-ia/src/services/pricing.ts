/**
 * Workshop billing rules.
 *
 * Rentals are charged per day: any started day is due, and a rental is always
 * billed at least one day. The commercial discount applies to the total,
 * before rounding to the cent.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface RentalTotalInput {
  startDate: Date;
  endDate: Date;
  dailyRateCents: number;
  discountPercent: number;
}

export interface RentalTotal {
  days: number;
  totalCents: number;
}

export const billedDays = (startDate: Date, endDate: Date): number => {
  const elapsed = endDate.getTime() - startDate.getTime();
  return Math.max(1, Math.floor(elapsed / MS_PER_DAY));
};

export const applyDiscount = (amountCents: number, discountPercent: number): number => {
  const discounted = amountCents * (1 - discountPercent / 100);
  return Math.round(discounted);
};

export const computeRentalTotal = ({
  startDate,
  endDate,
  dailyRateCents,
  discountPercent,
}: RentalTotalInput): RentalTotal => {
  const days = billedDays(startDate, endDate);
  const grossCents = days * dailyRateCents;
  return { days, totalCents: applyDiscount(grossCents, discountPercent) };
};
