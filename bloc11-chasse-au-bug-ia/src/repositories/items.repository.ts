import { pool } from "../config/db.js";
import type { Item, Queryable } from "../types.js";

export const itemsRepository = {
  async findById(id: number, client: Queryable = pool): Promise<Item | null> {
    const { rows } = await client.query(
      `SELECT id, label, reference, daily_rate_cents, available
         FROM items
        WHERE id = $1`,
      [id],
    );
    return (rows[0] as Item | undefined) ?? null;
  },

  async listAvailable(client: Queryable = pool): Promise<Item[]> {
    const { rows } = await client.query(
      `SELECT id, label, reference, daily_rate_cents, available
         FROM items
        WHERE available = TRUE
        ORDER BY label`,
    );
    return rows as Item[];
  },

  async setAvailability(id: number, available: boolean, client: Queryable = pool): Promise<void> {
    await client.query(`UPDATE items SET available = $2 WHERE id = $1`, [id, available]);
  },
};
