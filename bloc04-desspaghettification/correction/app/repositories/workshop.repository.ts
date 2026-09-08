/**
 * REPOSITORY - all the SQL about workshops, and nothing else.
 * Card 10: turning a SQL row into a domain object happens here, so that
 * `starts_at: string | Date` and `registered: string` never leak upwards.
 */
import type { Pool } from "pg";

import type { Workshop } from "../models/workshop.ts";

interface WorkshopRow {
  id: number;
  title: string;
  starts_at: Date;
  capacity: number;
  registered: string;
}

const SELECT_WORKSHOPS = `
  SELECT w.id, w.title, w.starts_at, w.capacity,
         (SELECT count(*) FROM registrations r
           WHERE r.workshop_id = w.id AND r.cancelled = FALSE) AS registered
    FROM workshops w`;

const toWorkshop = (row: WorkshopRow): Workshop => ({
  id: row.id,
  title: row.title,
  startsAt: new Date(row.starts_at),
  capacity: row.capacity,
  registered: Number(row.registered),
});

export interface WorkshopRepository {
  listUpcoming(): Promise<Workshop[]>;
  findById(id: number): Promise<Workshop | null>;
}

export const createWorkshopRepository = (pool: Pool): WorkshopRepository => ({
  /** Card 17 + card 13: the `ORDER BY` is an infrastructure concern. */
  async listUpcoming() {
    const result = await pool.query<WorkshopRow>(
      `${SELECT_WORKSHOPS} WHERE w.starts_at > now() ORDER BY w.starts_at`,
    );
    return result.rows.map(toWorkshop);
  },

  /** Card 27. Returns null rather than throwing: "not found" is not an error here. */
  async findById(id) {
    const result = await pool.query<WorkshopRow>(`${SELECT_WORKSHOPS} WHERE w.id = $1`, [id]);
    const row = result.rows[0];
    return row === undefined ? null : toWorkshop(row);
  },
});
