/**
 * SERVICE - listing upcoming workshops carries no business rule today, so this
 * service only delegates. That is a deliberate choice, and a good debrief
 * question: letting the controller call the repository directly would work
 * too, at the price of a controller that knows a repository exists.
 */
import type { Workshop } from "../models/workshop.ts";
import type { WorkshopRepository } from "../repositories/workshop.repository.ts";

export interface WorkshopsService {
  listUpcoming(): Promise<Workshop[]>;
}

export const createWorkshopsService = (workshops: WorkshopRepository): WorkshopsService => ({
  listUpcoming: () => workshops.listUpcoming(),
});
