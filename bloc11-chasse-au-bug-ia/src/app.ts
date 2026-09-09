import express, { type Express } from "express";

import { errorHandler } from "./middlewares/error-handler.js";
import { itemsRouter } from "./routes/items.routes.js";
import { rentalsRouter } from "./routes/rentals.routes.js";

/** Kept apart from the server so the app stays testable without opening a port. */
export const createApp = (): Express => {
  const app = express();

  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/rentals", rentalsRouter);
  app.use("/items", itemsRouter);

  app.use((req, res) => {
    res.status(404).json({ error: "Unknown route." });
  });
  app.use(errorHandler);

  return app;
};
