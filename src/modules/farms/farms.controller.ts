import { NextFunction, Request, Response } from "express";
import { FarmService } from "./farms.service";

export class FarmController {
  private readonly farmService: FarmService;

  constructor () {
    this.farmService = new FarmService();
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const allFarms = await this.farmService.getAllFarms({
        user: req.user,
        sort: req.query.sort as string,
        filter: req.query.filter as string,
      });

      res.status(200).send(allFarms);
    } catch (error) {
      next(error);
    }
  }
}
