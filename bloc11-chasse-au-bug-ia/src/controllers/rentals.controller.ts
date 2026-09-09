import type { NextFunction, Request, Response } from "express";

import { parseCreateRental, parseReturnRental } from "../schemas/rental.schema.js";
import { rentalsService } from "../services/rentals.service.js";

/** No business rule here: everything lives in the service. */
export const rentalsController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json(await rentalsService.list());
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = parseCreateRental(req.body as Record<string, unknown>);
      res.status(201).json(await rentalsService.create(input));
    } catch (error) {
      next(error);
    }
  },

  async returnRental(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = parseReturnRental(req.body as Record<string, unknown>);
      const receipt = await rentalsService.returnRental(Number(req.params.id), input);
      res.json(receipt);
    } catch (error) {
      next(error);
    }
  },
};
