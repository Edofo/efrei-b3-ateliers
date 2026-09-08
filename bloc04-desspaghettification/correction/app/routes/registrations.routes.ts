import type { RegistrationsController } from "../controllers/registrations.controller.ts";
import type { Route } from "./router.ts";

export const registrationRoutes = (controller: RegistrationsController): Route[] => [
  { method: "POST", path: "/registrations", handle: controller.create },
];
