import type { WorkshopsController } from "../controllers/workshops.controller.ts";
import type { Route } from "./router.ts";

export const workshopRoutes = (controller: WorkshopsController): Route[] => [
  { method: "GET", path: "/workshops", handle: controller.list },
];
