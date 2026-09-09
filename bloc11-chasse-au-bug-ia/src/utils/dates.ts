/**
 * PostgreSQL DATE columns are returned by node-postgres in local time
 * (midnight of the given day). Dates received by the API are built the same
 * way, so that we always compare comparable things.
 *
 * @param iso date formatted as YYYY-MM-DD
 */
export const parseLocalDate = (iso: string): Date => {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
};
