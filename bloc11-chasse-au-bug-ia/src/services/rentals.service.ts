import { pool } from "../config/db.js";
import { itemsRepository } from "../repositories/items.repository.js";
import { rentalsRepository } from "../repositories/rentals.repository.js";
import { rentersRepository } from "../repositories/renters.repository.js";
import type {
  CreateRentalInput,
  DetailedRental,
  Rental,
  RentalReceipt,
  ReturnRentalInput,
} from "../types.js";
import { parseLocalDate } from "../utils/dates.js";
import { conflict, notFound } from "../utils/http-error.js";
import { computeRentalTotal } from "./pricing.js";

/**
 * Rental business rules: item availability, billing, and putting the item
 * back in stock on return.
 */
export const rentalsService = {
  async list(): Promise<DetailedRental[]> {
    return rentalsRepository.listDetailed();
  },

  async create(input: CreateRentalInput): Promise<Rental> {
    const renter = await rentersRepository.findById(input.renterId);
    if (!renter) throw notFound("Customer not found.");

    const item = await itemsRepository.findById(input.itemId);
    if (!item) throw notFound("Item not found.");
    if (!item.available) throw conflict("This item is already rented out.");

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const rental = await rentalsRepository.insert(input, client);
      await itemsRepository.setAvailability(item.id, false, client);
      await client.query("COMMIT");
      return rental;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async returnRental(rentalId: number, input: ReturnRentalInput): Promise<RentalReceipt> {
    const rental = await rentalsRepository.findById(rentalId);
    if (!rental) throw notFound("Rental not found.");
    if (rental.returned_at) throw conflict("This rental is already closed.");

    const item = await itemsRepository.findById(rental.item_id);
    if (!item) throw notFound("Item not found.");

    const { days, totalCents } = computeRentalTotal({
      startDate: rental.start_date,
      endDate: parseLocalDate(input.returnedAt),
      dailyRateCents: item.daily_rate_cents,
      discountPercent: rental.discount_percent,
    });

    await rentalsRepository.markReturned(rentalId, { returnedAt: input.returnedAt, totalCents });
    await itemsRepository.setAvailability(item.id, true);
    await rentalsRepository.insertPayment(rentalId, totalCents);

    return { rentalId, days, totalCents };
  },
};
