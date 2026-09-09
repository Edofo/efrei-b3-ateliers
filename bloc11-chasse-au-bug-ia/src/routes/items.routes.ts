import { type NextFunction, type Request, type Response, Router } from "express";

import { itemsRepository } from "../repositories/items.repository.js";

export const itemsRouter = Router();

itemsRouter.get("/available", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await itemsRepository.listAvailable());
  } catch (error) {
    next(error);
  }
});
