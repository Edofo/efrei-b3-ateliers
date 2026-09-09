import { Router } from "express";

import { rentalsController } from "../controllers/rentals.controller.js";

export const rentalsRouter = Router();

rentalsRouter.get("/", rentalsController.list);
rentalsRouter.post("/", rentalsController.create);
rentalsRouter.post("/:id/return", rentalsController.returnRental);
