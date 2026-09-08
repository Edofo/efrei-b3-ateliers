import type { Registration } from "../models/registration.ts";
import type { Workshop } from "../models/workshop.ts";
import { formatDate } from "./date.view.ts";

export interface RegistrationView {
  id: number;
  workshop: string;
  registeredAt: string;
}

export const toRegistrationView = (
  registration: Registration,
  workshop: Workshop,
): RegistrationView => ({
  id: registration.id,
  workshop: workshop.title,
  registeredAt: formatDate(registration.registeredAt),
});
