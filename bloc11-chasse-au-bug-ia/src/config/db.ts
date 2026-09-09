import pg from "pg";

/**
 * Connection pool shared by the whole application.
 * One pool per process: this is the node-postgres recommendation.
 */
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on("error", (error) => {
  console.error("[db] idle client error", error);
});
