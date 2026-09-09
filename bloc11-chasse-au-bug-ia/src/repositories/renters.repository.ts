import { pool } from "../config/db.js";
import type { Queryable, Renter } from "../types.js";

export const rentersRepository = {
  async findById(id: number, client: Queryable = pool): Promise<Renter | null> {
    const { rows } = await client.query(`SELECT id, full_name, email FROM renters WHERE id = $1`, [
      id,
    ]);
    return (rows[0] as Renter | undefined) ?? null;
  },
};
