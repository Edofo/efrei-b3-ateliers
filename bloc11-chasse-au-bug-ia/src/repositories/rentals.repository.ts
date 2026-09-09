import { pool } from "../config/db.js";
import type { CreateRentalInput, DetailedRental, Queryable, Rental } from "../types.js";
import { itemsRepository } from "./items.repository.js";
import { rentersRepository } from "./renters.repository.js";

const RENTAL_COLUMNS = `id, renter_id, item_id, start_date, expected_return_date,
                        discount_percent, returned_at, total_cents`;

/**
 * Every method accepts an optional client, so the service can chain several
 * writes on the same connection.
 */
export const rentalsRepository = {
  async findById(id: number, client: Queryable = pool): Promise<Rental | null> {
    const { rows } = await client.query(`SELECT ${RENTAL_COLUMNS} FROM rentals WHERE id = $1`, [
      id,
    ]);
    return (rows[0] as Rental | undefined) ?? null;
  },

  /** Related reads are parallelised so we do not chain round-trips needlessly. */
  async listDetailed(client: Queryable = pool): Promise<DetailedRental[]> {
    const { rows } = await client.query(
      `SELECT ${RENTAL_COLUMNS} FROM rentals ORDER BY start_date DESC`,
    );

    return Promise.all(
      (rows as Rental[]).map(async (rental) => ({
        ...rental,
        item: await itemsRepository.findById(rental.item_id, client),
        renter: await rentersRepository.findById(rental.renter_id, client),
      })),
    );
  },

  async insert(rental: CreateRentalInput, client: Queryable = pool): Promise<Rental> {
    const { rows } = await client.query(
      `INSERT INTO rentals (renter_id, item_id, start_date, expected_return_date, discount_percent)
            VALUES ($1, $2, $3, $4, $5)
         RETURNING ${RENTAL_COLUMNS}`,
      [
        rental.renterId,
        rental.itemId,
        rental.startDate,
        rental.expectedReturnDate,
        rental.discountPercent,
      ],
    );
    return rows[0] as Rental;
  },

  async markReturned(
    id: number,
    { returnedAt, totalCents }: { returnedAt: string; totalCents: number },
    client: Queryable = pool,
  ): Promise<void> {
    await client.query(
      `UPDATE rentals
          SET returned_at = $2,
              total_cents = $3
        WHERE id = $1`,
      [id, returnedAt, totalCents],
    );
  },

  async insertPayment(
    rentalId: number,
    amountCents: number,
    client: Queryable = pool,
  ): Promise<void> {
    await client.query(`INSERT INTO payments (rental_id, amount_cents) VALUES ($1, $2)`, [
      rentalId,
      amountCents,
    ]);
  },
};
