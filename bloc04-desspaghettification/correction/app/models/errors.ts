/**
 * MODEL - the vocabulary the service uses to refuse.
 *
 * A domain error carries a *code*, never an HTTP status and never a sentence
 * shown to a user: choosing the status (card 16) and the wording (card 9) is
 * the controller's job. That is what makes the service reusable from a CLI,
 * a queue worker or a test.
 */
export type DomainErrorCode =
  | "WORKSHOP_NOT_FOUND"
  | "REGISTRATION_CLOSED"
  | "WORKSHOP_FULL"
  | "ALREADY_REGISTERED";

export class DomainError extends Error {
  readonly code: DomainErrorCode;

  constructor(code: DomainErrorCode) {
    super(code);
    this.name = "DomainError";
    this.code = code;
  }
}
