import type { WorkshopsService } from "../services/workshops.service.ts";
import { toWorkshopView } from "../views/workshop.view.ts";
import type { Handler } from "./http.ts";
import { sendJson } from "./http.ts";

export interface WorkshopsController {
  list: Handler;
}

export const createWorkshopsController = (service: WorkshopsService): WorkshopsController => ({
  list: async (_req, res) => {
    const workshops = await service.listUpcoming();
    sendJson(res, 200, workshops.map(toWorkshopView));
  },
});
