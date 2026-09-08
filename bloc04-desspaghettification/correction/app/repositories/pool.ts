/**
 * REPOSITORY - cards 21 and 40: the connection pool and its shutdown.
 * The rest of the application never imports `pg`.
 */
import pg from "pg";
import type { Pool } from "pg";

const DEFAULT_URL = "postgres://workshop:workshop@localhost:5434/registrations";

export const createPool = (): Pool =>
  new pg.Pool({ connectionString: process.env.DATABASE_URL ?? DEFAULT_URL });

export const closePool = async (pool: Pool): Promise<void> => {
  await pool.end();
};
