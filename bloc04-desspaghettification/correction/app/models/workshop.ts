/**
 * MODEL - what a workshop *is*, and the arithmetic that follows from it.
 * No SQL, no HTTP, no formatting: this file would survive a change of
 * database, of framework, and of user interface.
 */
export interface Workshop {
  id: number;
  title: string;
  startsAt: Date;
  capacity: number;
  registered: number;
}

/** Card 5: with `registered` already on the model, this is plain arithmetic. */
export const seatsLeft = (workshop: Workshop): number => workshop.capacity - workshop.registered;

export const hoursUntilStart = (workshop: Workshop, now: Date): number =>
  (workshop.startsAt.getTime() - now.getTime()) / 3_600_000;
