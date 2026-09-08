/**
 * CONTROLLER - card 35 (is the field there?), card 16 (business error to HTTP
 * status) and card 9 (the sentence the user reads). The rules themselves are
 * in the service; this file only translates them into HTTP.
 */
import type { DomainErrorCode } from "../models/errors.ts";
import { DomainError } from "../models/errors.ts";
import type { RegistrationsService } from "../services/registrations.service.ts";
import { toRegistrationView } from "../views/registration.view.ts";
import type { Handler } from "./http.ts";
import { readJsonBody, sendError, sendJson } from "./http.ts";

const HTTP_ERRORS: Record<DomainErrorCode, { status: number; message: string }> = {
  WORKSHOP_NOT_FOUND: { status: 404, message: "Workshop not found." },
  REGISTRATION_CLOSED: {
    status: 409,
    message: "Registrations close 24 hours before the workshop.",
  },
  WORKSHOP_FULL: { status: 409, message: "This workshop is full." },
  ALREADY_REGISTERED: { status: 409, message: "This participant is already registered." },
};

export interface RegistrationsController {
  create: Handler;
}

export const createRegistrationsController = (
  service: RegistrationsService,
): RegistrationsController => ({
  create: async (req, res) => {
    const body = await readJsonBody(req);

    if (!body.workshopId || !body.participantId) {
      sendError(res, 400, "workshopId and participantId are required.");
      return;
    }

    try {
      const { registration, workshop } = await service.register(
        Number(body.workshopId),
        Number(body.participantId),
      );
      sendJson(res, 201, toRegistrationView(registration, workshop));
    } catch (error) {
      if (error instanceof DomainError) {
        const { status, message } = HTTP_ERRORS[error.code];
        sendError(res, status, message);
        return;
      }
      throw error;
    }
  },
});
