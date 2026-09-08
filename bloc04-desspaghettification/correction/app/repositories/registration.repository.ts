/**
 * REPOSITORY - cards 4 and 11 (the *query*, not the rule it serves).
 */
import type { Pool } from "pg";

import type { Registration } from "../models/registration.ts";

interface RegistrationRow {
  id: number;
  workshop_id: number;
  participant_id: number;
  registered_at: Date;
}

const toRegistration = (row: RegistrationRow): Registration => ({
  id: row.id,
  workshopId: row.workshop_id,
  participantId: row.participant_id,
  registeredAt: new Date(row.registered_at),
});

export interface RegistrationRepository {
  existsActive(workshopId: number, participantId: number): Promise<boolean>;
  create(workshopId: number, participantId: number): Promise<Registration>;
}

export const createRegistrationRepository = (pool: Pool): RegistrationRepository => ({
  async existsActive(workshopId, participantId) {
    const result = await pool.query(
      `SELECT id FROM registrations
        WHERE workshop_id = $1 AND participant_id = $2 AND cancelled = FALSE`,
      [workshopId, participantId],
    );
    return result.rows.length > 0;
  },

  async create(workshopId, participantId) {
    const result = await pool.query<RegistrationRow>(
      `INSERT INTO registrations (workshop_id, participant_id)
            VALUES ($1, $2)
         RETURNING id, workshop_id, participant_id, registered_at`,
      [workshopId, participantId],
    );
    return toRegistration(result.rows[0]);
  },
});
