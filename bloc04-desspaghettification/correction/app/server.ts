/**
 * Composition root: the only file that knows every layer exists. It builds the
 * object graph (repositories -> services -> controllers -> routes) and starts
 * the HTTP server. Card 25 (logging a technical error) lives here, at the
 * outer edge, because it is a cross-cutting concern rather than a layer.
 */
import http from "node:http";

import { sendError } from "./controllers/http.ts";
import { createRegistrationsController } from "./controllers/registrations.controller.ts";
import { createWorkshopsController } from "./controllers/workshops.controller.ts";
import { closePool, createPool } from "./repositories/pool.ts";
import { createRegistrationRepository } from "./repositories/registration.repository.ts";
import { createWorkshopRepository } from "./repositories/workshop.repository.ts";
import { registrationRoutes } from "./routes/registrations.routes.ts";
import { createRouter } from "./routes/router.ts";
import { workshopRoutes } from "./routes/workshops.routes.ts";
import { createRegistrationsService } from "./services/registrations.service.ts";
import { createWorkshopsService } from "./services/workshops.service.ts";

const pool = createPool();

const workshopRepository = createWorkshopRepository(pool);
const registrationRepository = createRegistrationRepository(pool);

const workshopsService = createWorkshopsService(workshopRepository);
const registrationsService = createRegistrationsService(workshopRepository, registrationRepository);

const router = createRouter([
  ...workshopRoutes(createWorkshopsController(workshopsService)),
  ...registrationRoutes(createRegistrationsController(registrationsService)),
]);

const server = http.createServer((req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  router(req, res).catch((error: unknown) => {
    console.error(error);
    sendError(res, 500, "Internal error.");
  });
});

server.listen(4000, () => {
  console.log("[bloc04] API on http://localhost:4000");
});

const shutdown = (): void => {
  server.close(() => {
    void closePool(pool);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
