/**
 * ROUTES - the map from (method, path) to a controller. Adding an endpoint
 * means touching this layer and a controller, nothing else.
 */
import type { Handler } from "../controllers/http.ts";
import { sendError } from "../controllers/http.ts";

export interface Route {
  method: string;
  path: string;
  handle: Handler;
}

export const createRouter =
  (routes: Route[]): Handler =>
  async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const route = routes.find((candidate) => candidate.method === req.method && candidate.path === url.pathname);

    if (route === undefined) {
      sendError(res, 404, "Unknown route.");
      return;
    }

    await route.handle(req, res);
  };
