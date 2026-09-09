/** Domain model of the rental workshop. */

export interface Renter {
  id: number;
  full_name: string;
  email: string;
}

export interface Item {
  id: number;
  label: string;
  reference: string;
  daily_rate_cents: number;
  available: boolean;
}

export interface Rental {
  id: number;
  renter_id: number;
  item_id: number;
  start_date: Date;
  expected_return_date: Date;
  discount_percent: number;
  returned_at: Date | null;
  total_cents: number | null;
}

export interface DetailedRental extends Rental {
  item: Item | null;
  renter: Renter | null;
}

/** A rental request, once validated. */
export interface CreateRentalInput {
  renterId: number;
  itemId: number;
  startDate: string;
  expectedReturnDate: string;
  discountPercent: number;
}

export interface ReturnRentalInput {
  returnedAt: string;
}

export interface RentalReceipt {
  rentalId: number;
  days: number;
  totalCents: number;
}

/** Anything able to run a query: the pool, or a dedicated client. */
export interface Queryable {
  query: (text: string, values?: unknown[]) => Promise<{ rows: unknown[] }>;
}
