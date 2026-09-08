/**
 * VIEW - cards 28 and 32: the "Full" badge and the singular of "1 seat left".
 * A view takes a domain object and returns something ready to display.
 */
import type { Workshop } from "../models/workshop.ts";
import { seatsLeft } from "../models/workshop.ts";
import { formatDate, formatTime } from "./date.view.ts";

export interface WorkshopView {
  id: number;
  title: string;
  date: string;
  time: string;
  seatsLeft: number;
  label: string;
}

const seatsLabel = (remaining: number): string => {
  if (remaining <= 0) return "Full";
  if (remaining === 1) return "1 seat left";
  return `${remaining} seats left`;
};

export const toWorkshopView = (workshop: Workshop): WorkshopView => {
  const remaining = seatsLeft(workshop);
  return {
    id: workshop.id,
    title: workshop.title,
    date: formatDate(workshop.startsAt),
    time: formatTime(workshop.startsAt),
    seatsLeft: remaining,
    label: seatsLabel(remaining),
  };
};
