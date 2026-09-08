/**
 * SERVICE - the three business rules, and the order in which they are checked
 * (card 34). No SQL, no HTTP status, no date formatting: if you find any of
 * those here, the file is drifting back towards the spaghetti.
 *
 * `now` is injected so the 24-hour rule can be tested without waiting.
 */
import { DomainError } from "../models/errors.ts";
import type { Registration } from "../models/registration.ts";
import type { Workshop } from "../models/workshop.ts";
import { hoursUntilStart, seatsLeft } from "../models/workshop.ts";
import type { RegistrationRepository } from "../repositories/registration.repository.ts";
import type { WorkshopRepository } from "../repositories/workshop.repository.ts";

const REGISTRATION_DEADLINE_HOURS = 24;

export interface RegistrationOutcome {
  registration: Registration;
  workshop: Workshop;
}

export interface RegistrationsService {
  register(workshopId: number, participantId: number): Promise<RegistrationOutcome>;
}

export const createRegistrationsService = (
  workshops: WorkshopRepository,
  registrations: RegistrationRepository,
  now: () => Date = () => new Date(),
): RegistrationsService => ({
  async register(workshopId, participantId) {
    const workshop = await workshops.findById(workshopId);
    if (workshop === null) {
      throw new DomainError("WORKSHOP_NOT_FOUND");
    }

    // Card 26 - registrations close 24 hours before the workshop.
    if (hoursUntilStart(workshop, now()) < REGISTRATION_DEADLINE_HOURS) {
      throw new DomainError("REGISTRATION_CLOSED");
    }

    // Cards 7 and 30 - a full workshop accepts nobody.
    if (seatsLeft(workshop) <= 0) {
      throw new DomainError("WORKSHOP_FULL");
    }

    // Card 11 - nobody registers twice.
    if (await registrations.existsActive(workshopId, participantId)) {
      throw new DomainError("ALREADY_REGISTERED");
    }

    const registration = await registrations.create(workshopId, participantId);
    return { registration, workshop };
  },
});
