/**
 * MODEL - card 36: a registration links a participant and a workshop.
 */
export interface Registration {
  id: number;
  workshopId: number;
  participantId: number;
  registeredAt: Date;
}
